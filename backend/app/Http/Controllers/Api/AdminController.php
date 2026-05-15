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
