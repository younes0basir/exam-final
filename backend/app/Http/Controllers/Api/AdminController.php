<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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

    public function updateUser(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'role' => 'sometimes|in:admin,professor,student',
            'password' => 'sometimes|min:8',
        ]);

        $data = $request->only(['name', 'email', 'role']);
        
        if ($request->filled('password')) {
            $data['password'] = bcrypt($request->password);
        }

        $user->update($data);

        return response()->json(['message' => 'User updated successfully', 'user' => $user]);
    }

    public function deleteUser($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
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

    public function storeFiliere(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:filieres,code',
            'description' => 'nullable|string',
            'groupes' => 'nullable|array',
            'groupes.*.nom' => 'required|string',
            'modules' => 'nullable|array',
            'modules.*.nom' => 'required|string',
            'modules.*.professors' => 'nullable|array',
            'modules.*.professors.*' => 'exists:users,id',
        ]);

        $filiere = Filiere::create($request->only(['nom', 'code', 'description']));

        // Create groups if provided
        if ($request->has('groupes')) {
            foreach ($request->groupes as $groupeData) {
                DB::table('groupes')->insert([
                    'nom' => $groupeData['nom'],
                    'filiere_id' => $filiere->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);
            }
        }

        // Create modules and assign professors if provided
        if ($request->has('modules')) {
            foreach ($request->modules as $moduleData) {
                $moduleId = DB::table('modules')->insertGetId([
                    'nom' => $moduleData['nom'],
                    'filiere_id' => $filiere->id,
                    'created_at' => now(),
                    'updated_at' => now(),
                ]);

                // Assign professors to module
                if (isset($moduleData['professors']) && is_array($moduleData['professors'])) {
                    foreach ($moduleData['professors'] as $professorId) {
                        DB::table('module_professor')->insert([
                            'module_id' => $moduleId,
                            'professor_id' => $professorId,
                        ]);
                    }
                }
            }
        }

        return response()->json(['message' => 'Filiere created successfully', 'filiere' => $filiere], 201);
    }

    public function updateFiliere(Request $request, $id)
    {
        $filiere = Filiere::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'code' => 'sometimes|string|max:50|unique:filieres,code,' . $id,
            'description' => 'nullable|string',
        ]);

        $filiere->update($request->only(['nom', 'code', 'description']));

        return response()->json(['message' => 'Filiere updated successfully', 'filiere' => $filiere]);
    }

    public function deleteFiliere($id)
    {
        $filiere = Filiere::findOrFail($id);
        $filiere->delete();

        return response()->json(['message' => 'Filiere deleted successfully']);
    }

    public function salles()
    {
        $salles = Salle::all();
        return response()->json($salles);
    }

    public function storeSalle(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'capacite' => 'required|integer|min:1',
            'type' => 'required|string|max:255',
            'equipements' => 'nullable|string',
        ]);

        $salle = Salle::create($request->only(['nom', 'capacite', 'type', 'equipements']));

        return response()->json(['message' => 'Salle created successfully', 'salle' => $salle], 201);
    }

    public function updateSalle(Request $request, $id)
    {
        $salle = Salle::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'capacite' => 'sometimes|integer|min:1',
            'type' => 'sometimes|string|max:255',
            'equipements' => 'nullable|string',
        ]);

        $salle->update($request->only(['nom', 'capacite', 'type', 'equipements']));

        return response()->json(['message' => 'Salle updated successfully', 'salle' => $salle]);
    }

    public function deleteSalle($id)
    {
        $salle = Salle::findOrFail($id);
        $salle->delete();

        return response()->json(['message' => 'Salle deleted successfully']);
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
        $groupes = Groupe::with('filiere')->withCount('students')->get();
        return response()->json($groupes);
    }

    public function storeGroupe(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        $groupe = Groupe::create($request->only(['nom', 'filiere_id']));

        return response()->json(['message' => 'Groupe created successfully', 'groupe' => $groupe], 201);
    }

    public function updateGroupe(Request $request, $id)
    {
        $groupe = Groupe::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'filiere_id' => 'sometimes|exists:filieres,id',
        ]);

        $groupe->update($request->only(['nom', 'filiere_id']));

        return response()->json(['message' => 'Groupe updated successfully', 'groupe' => $groupe]);
    }

    public function deleteGroupe($id)
    {
        $groupe = Groupe::findOrFail($id);
        $groupe->delete();

        return response()->json(['message' => 'Groupe deleted successfully']);
    }

    public function modules()
    {
        $modules = Module::with(['filiere', 'professors'])->get();
        return response()->json($modules);
    }

    public function storeModule(Request $request)
    {
        $request->validate([
            'nom' => 'required|string|max:255',
            'filiere_id' => 'required|exists:filieres,id',
        ]);

        $module = Module::create($request->only(['nom', 'filiere_id']));

        return response()->json(['message' => 'Module created successfully', 'module' => $module], 201);
    }

    public function updateModule(Request $request, $id)
    {
        $module = Module::findOrFail($id);

        $request->validate([
            'nom' => 'sometimes|string|max:255',
            'filiere_id' => 'sometimes|exists:filieres,id',
        ]);

        $module->update($request->only(['nom', 'filiere_id']));

        return response()->json(['message' => 'Module updated successfully', 'module' => $module]);
    }

    public function deleteModule($id)
    {
        $module = Module::findOrFail($id);
        $module->delete();

        return response()->json(['message' => 'Module deleted successfully']);
    }

    public function toggleProfessor(Request $request, $moduleId)
    {
        $request->validate([
            'professor_id' => 'required|exists:users,id',
        ]);

        $module = Module::findOrFail($moduleId);
        $professorId = $request->professor_id;

        $exists = DB::table('module_professor')
            ->where('module_id', $moduleId)
            ->where('professor_id', $professorId)
            ->exists();

        if ($exists) {
            DB::table('module_professor')
                ->where('module_id', $moduleId)
                ->where('professor_id', $professorId)
                ->delete();
        } else {
            DB::table('module_professor')->insert([
                'module_id' => $moduleId,
                'professor_id' => $professorId,
            ]);
        }

        return response()->json(['message' => 'Professor assignment toggled successfully']);
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
