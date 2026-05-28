<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Note;
use App\Models\User;

class ProfessorController extends Controller
{
    public function stats()
    {
        $user = auth()->user();
        
        $stats = [
            'modules_count' => $user->modules()->count(),
            'pending_notes' => Note::whereIn('module_id', $user->modules->pluck('id'))->whereNull('note_finale')->count(),
        ];

        return response()->json($stats);
    }

    public function modules()
    {
        $user = auth()->user();
        $modules = $user->modules()->with('filiere')->get();

        // Add student count for each module
        $modulesWithStudents = $modules->map(function($module) {
            $studentsCount = User::whereHas('groups', function($q) use ($module) {
                $q->where('filiere_id', $module->filiere_id);
            })->where('role', 'student')->count();

            $module->students_count = $studentsCount;
            return $module;
        });

        return response()->json($modulesWithStudents);
    }

    public function getGrades($moduleId)
    {
        $module = auth()->user()->modules()->with('filiere.groupes.students')->findOrFail($moduleId);
        
        $students = User::whereHas('groups', function($q) use ($module) {
            $q->where('filiere_id', $module->filiere_id);
        })->where('role', 'student')->get();

        $existingNotes = Note::where('module_id', $moduleId)->get()->keyBy('student_id');

        return response()->json([
            'module' => $module,
            'students' => $students,
            'existingNotes' => $existingNotes
        ]);
    }

    public function storeGrades(Request $request, $moduleId)
    {
        foreach ($request->grades as $studentId => $data) {
            $cc1 = $data['cc1'] ?? null;
            $cc2 = $data['cc2'] ?? null;
            $examen = $data['examen'] ?? null;

            // Calcul automatique de la note finale selon formule obligatoire
            // Note finale = ((CC1 + CC2) / 2) × 0.4 + Examen × 0.6
            $noteFinale = null;
            if ($cc1 !== null && $cc2 !== null && $examen !== null) {
                $noteFinale = round((($cc1 + $cc2) / 2) * 0.4 + $examen * 0.6, 2);
            }

            Note::updateOrCreate(
                ['module_id' => $moduleId, 'student_id' => $studentId],
                [
                    'cc1' => $cc1,
                    'cc2' => $cc2,
                    'examen' => $examen,
                    'note_finale' => $noteFinale,
                ]
            );
        }

        return response()->json(['message' => 'Grades saved successfully']);
    }

    public function sessionLog()
    {
        $sessions = \App\Models\CahierTexte::where('prof_id', auth()->id())
            ->with(['module', 'groupe'])
            ->latest()
            ->paginate(20);
        
        return response()->json($sessions);
    }
}
