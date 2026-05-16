<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use App\Models\Filiere;
use App\Models\Groupe;
use App\Models\Module;
use App\Models\Salle;
use App\Models\DemandeAdministrative;
use App\Models\Absence;
use App\Models\Note;
use Carbon\Carbon;

class AdminController extends Controller
{
    public function stats()
    {
        $stats = [
            'students' => User::where('role', 'student')->count(),
            'professors' => User::where('role', 'professor')->count(),
            'filieres' => Filiere::count(),
            'modules' => Module::count(),
            'salles' => Salle::count(),
        ];

        return response()->json($stats);
    }

    public function analytics()
    {
        // Absenteeism Rate by Month (last 6 months)
        $absencesByMonth = [];
        for ($i = 5; $i >= 0; $i--) {
            $month = Carbon::now()->subMonths($i);
            $count = Absence::whereYear('date_absence', $month->year)
                ->whereMonth('date_absence', $month->month)
                ->count();
            $absencesByMonth[] = [
                'month' => $month->format('M Y'),
                'count' => $count,
            ];
        }

        // Grade Distribution
        $grades = Note::whereNotNull('note_finale')->get();
        $gradeDistribution = [
            'excellent' => $grades->where('note_finale', '>=', 16)->count(), // 16-20
            'good' => $grades->whereBetween('note_finale', [12, 15.99])->count(), // 12-15.99
            'average' => $grades->whereBetween('note_finale', [10, 11.99])->count(), // 10-11.99
            'fail' => $grades->where('note_finale', '<', 10)->count(), // 0-9.99
        ];

        // Average Grade by Module
        $moduleAverages = Note::selectRaw('module_id, AVG(note_finale) as average')
            ->whereNotNull('note_finale')
            ->groupBy('module_id')
            ->with('module')
            ->get()
            ->map(function($item) {
                return [
                    'module' => $item->module?->nom ?? 'Unknown',
                    'average' => round($item->average, 2),
                ];
            });

        // Students per Filiere
        $studentsPerFiliere = Filiere::withCount(['groupes'])
            ->get()
            ->map(function($filiere) {
                $studentCount = User::where('role', 'student')
                    ->whereHas('groups', function($query) use ($filiere) {
                        $query->where('filiere_id', $filiere->id);
                    })
                    ->count();
                return [
                    'filiere' => $filiere->nom,
                    'students' => $studentCount,
                ];
            });

        // Justified vs Unjustified Absences
        $totalAbsences = Absence::count();
        $justifiedAbsences = Absence::where('statut_justification', 'validated')->count();
        $unjustifiedAbsences = $totalAbsences - $justifiedAbsences;

        $absenceStatus = [
            'justified' => $justifiedAbsences,
            'unjustified' => $unjustifiedAbsences,
        ];

        // Attendance Rate Trend (last 30 days)
        $attendanceTrend = [];
        for ($i = 29; $i >= 0; $i--) {
            $date = Carbon::now()->subDays($i);
            $totalStudents = User::where('role', 'student')->count();
            $absentCount = Absence::whereDate('date_absence', $date)->count();
            $attendanceRate = $totalStudents > 0 
                ? round((($totalStudents - $absentCount) / $totalStudents) * 100, 2)
                : 100;
            $attendanceTrend[] = [
                'date' => $date->format('d M'),
                'rate' => $attendanceRate,
            ];
        }

        return response()->json([
            'absences_by_month' => $absencesByMonth,
            'grade_distribution' => $gradeDistribution,
            'module_averages' => $moduleAverages,
            'students_per_filiere' => $studentsPerFiliere,
            'absence_status' => $absenceStatus,
            'attendance_trend' => $attendanceTrend,
        ]);
    }

    public function users()
    {
        $users = User::latest()->paginate(20);
        return response()->json($users);
    }

    public function storeStudent(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => bcrypt($request->password),
            'role' => 'student',
        ]);

        return response()->json(['message' => 'Student created successfully', 'user' => $user], 201);
    }

    public function filieres()
    {
        $filieres = Filiere::withCount(['groupes', 'modules'])->get();
        return response()->json($filieres);
    }

    public function timetable()
    {
        $viewType = request('view', 'all');
        $professorId = request('professor_id');
        $filiereId = request('filiere_id');
        $groupeId = request('groupe_id');
        $moduleId = request('module_id');
        
        $query = \App\Models\EmploiDuTemps::with(['groupe.filiere', 'module', 'professor', 'salle']);
        
        if ($viewType === 'professor' && $professorId) {
            $query->where('prof_id', $professorId);
        } elseif ($viewType === 'filiere' && $filiereId) {
            $query->whereHas('groupe', function($q) use ($filiereId) {
                $q->where('filiere_id', $filiereId);
            });
        }
        
        if ($groupeId) {
            $query->where('groupe_id', $groupeId);
        }
        if ($moduleId) {
            $query->where('module_id', $moduleId);
        }
        
        $schedules = $query->orderBy('jour')->orderBy('heure_debut')->get();
        
        // Transform to match frontend expected format
        $transformed = $schedules->map(function($entry) {
            return [
                'id' => $entry->id,
                'jour' => $entry->jour,
                'heure_debut' => $entry->heure_debut,
                'heure_fin' => $entry->heure_fin,
                'salle' => $entry->salle?->nom ?? 'Unknown',
                'module' => $entry->module?->nom ?? 'Unknown',
                'professeur' => $entry->professor?->name ?? 'Unknown',
            ];
        });
        
        return response()->json($transformed);
    }

    public function groupes()
    {
        $groupes = Groupe::with('filiere')->get();
        return response()->json($groupes);
    }

    public function modules()
    {
        $modules = Module::with('filiere')->get();
        return response()->json($modules);
    }

    public function requests()
    {
        $requests = DemandeAdministrative::with('user')
            ->latest()
            ->paginate(20);
        
        return response()->json($requests);
    }

    public function updateRequestStatus(Request $request, $id)
    {
        $adminRequest = DemandeAdministrative::findOrFail($id);
        
        $request->validate([
            'statut' => 'required|in:validated,rejected',
            'motif_rejet' => 'required_if:statut,rejected'
        ]);

        $adminRequest->update([
            'statut' => $request->statut,
            'motif_rejet' => $request->motif_rejet
        ]);

        return response()->json(['message' => 'Request updated successfully', 'request' => $adminRequest]);
    }
}
