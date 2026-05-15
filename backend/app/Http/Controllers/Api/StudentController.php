<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\DemandeAdministrative;
use App\Models\ClassroomDocument;
use App\Models\EmploiDuTemps;

class StudentController extends Controller
{
    public function stats()
    {
        $user = auth()->user();
        
        $stats = [
            'average' => Note::where('student_id', $user->id)->avg('note_finale') ?? 0,
            'absences' => $user->absences()->count(),
            'modules' => $user->groups()->count(),
        ];

        return response()->json($stats);
    }

    public function results()
    {
        $notes = Note::with('module')->where('student_id', auth()->id())->get();
        
        // Transform to match frontend expected format
        $results = $notes->map(function($note) {
            return [
                'id' => $note->id,
                'module_nom' => $note->module?->nom ?? 'Unknown Module',
                'note' => (float) $note->note_finale,
                'semestre' => 1, // Default value - DB doesn't have this field
                'annee' => '2025-2026', // Default value - DB doesn't have this field
            ];
        });
        
        return response()->json($results);
    }

    public function timetable()
    {
        $user = auth()->user();
        $group = $user->groups()->first();
        
        $schedule = $group ? EmploiDuTemps::where('groupe_id', $group->id)
            ->with(['module', 'professor', 'salle'])
            ->orderBy('jour')
            ->orderBy('heure_debut')
            ->get() : collect();
        
        // Transform to match frontend expected format
        $transformed = $schedule->map(function($entry) {
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

    public function materials()
    {
        $user = auth()->user();
        $filiereIds = $user->groups()->pluck('filiere_id');
        
        $materials = ClassroomDocument::whereIn('module_id', function($query) use ($filiereIds) {
            $query->select('id')
                  ->from('modules')
                  ->whereIn('filiere_id', $filiereIds);
        })->with(['module', 'professor'])->latest()->get();
        
        // Transform to match frontend expected format
        $transformed = $materials->map(function($doc) {
            return [
                'id' => $doc->id,
                'titre' => $doc->titre,
                'description' => '', // Default - not in DB
                'fichier_url' => $doc->file_path,
                'uploaded_at' => $doc->created_at,
                'professeur_nom' => $doc->professor?->name ?? 'Unknown',
            ];
        });
        
        return response()->json($transformed);
    }

    public function absences()
    {
        $absences = auth()->user()->absences()->with('module')->latest()->paginate(20);
        return response()->json($absences);
    }

    public function requests()
    {
        $requests = DemandeAdministrative::where('user_id', auth()->id())->latest()->get();
        return response()->json($requests);
    }

    public function storeRequest(Request $request)
    {
        $user = auth()->user();

        // Types de demandes selon le rôle
        $studentTypes = [
            'Attestation de scolarité',
            'Relevé de notes',
            'Certificat d\'inscription'
        ];

        $professorTypes = [
            'Attestation de travail',
            'Ordre de mission'
        ];

        $validTypes = $user->role === 'professor' ? $professorTypes : $studentTypes;

        $request->validate([
            'type' => 'required|in:' . implode(',', $validTypes),
            'motif' => 'nullable|string|max:500',
        ]);

        $adminRequest = DemandeAdministrative::create([
            'user_id' => auth()->id(),
            'type' => $request->type,
            'motif' => $request->motif,
            'statut' => 'pending',
        ]);

        return response()->json(['message' => 'Request submitted successfully', 'request' => $adminRequest], 201);
    }
}
