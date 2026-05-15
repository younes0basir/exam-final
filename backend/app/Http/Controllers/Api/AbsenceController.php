<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Absence;
use Illuminate\Support\Facades\Storage;

class AbsenceController extends Controller
{
    /**
     * Admin: Liste de toutes les absences avec filtres
     */
    public function allAbsences(Request $request)
    {
        $query = Absence::with(['student', 'module'])->latest();

        // Filtres optionnels
        if ($request->has('student_id')) {
            $query->where('student_id', $request->student_id);
        }
        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }
        if ($request->has('statut')) {
            $query->where('statut_justification', $request->statut);
        }
        if ($request->has('est_justifie')) {
            $query->where('est_justifie', $request->boolean('est_justifie'));
        }

        $absences = $query->paginate(20);
        return response()->json($absences);
    }

    /**
     * Admin: Valider/Refuser un justificatif d'absence
     */
    public function validateAbsence(Request $request, $id)
    {
        $request->validate([
            'statut_justification' => 'required|in:validated,rejected',
            'motif_rejet' => 'required_if:statut_justification,rejected|nullable|string|max:500',
        ]);

        $absence = Absence::findOrFail($id);

        $absence->update([
            'statut_justification' => $request->statut_justification,
            'motif_rejet' => $request->motif_rejet,
            'est_justifie' => $request->statut_justification === 'validated',
        ]);

        return response()->json([
            'message' => 'Justificatif traité avec succès',
            'absence' => $absence->load(['student', 'module'])
        ]);
    }

    /**
     * Professor: Liste des absences de ses modules
     */
    public function professorAbsences(Request $request)
    {
        $professor = auth()->user();
        $moduleIds = $professor->modules()->pluck('modules.id');

        $query = Absence::whereIn('module_id', $moduleIds)
            ->with(['student', 'module'])
            ->latest();

        // Filtres optionnels
        if ($request->has('module_id') && in_array($request->module_id, $moduleIds->toArray())) {
            $query->where('module_id', $request->module_id);
        }

        $absences = $query->paginate(20);
        return response()->json($absences);
    }

    /**
     * Professor: Enregistrer une absence
     */
    public function storeAbsence(Request $request)
    {
        $request->validate([
            'student_id' => 'required|exists:users,id',
            'module_id' => 'required|exists:modules,id',
            'date_absence' => 'required|date',
            'seance_debut' => 'required|date_format:H:i',
            'seance_fin' => 'required|date_format:H:i|after:seance_debut',
        ]);

        // Vérifier que le professeur enseigne ce module
        $professor = auth()->user();
        $teachesModule = $professor->modules()->where('modules.id', $request->module_id)->exists();

        if (!$teachesModule) {
            return response()->json([
                'message' => 'Vous ne pouvez pas marquer d\'absence pour ce module'
            ], 403);
        }

        $absence = Absence::create([
            'student_id' => $request->student_id,
            'module_id' => $request->module_id,
            'date_absence' => $request->date_absence,
            'seance_debut' => $request->seance_debut,
            'seance_fin' => $request->seance_fin,
            'est_justifie' => false,
            'statut_justification' => 'pending',
        ]);

        return response()->json([
            'message' => 'Absence enregistrée avec succès',
            'absence' => $absence->load(['student', 'module'])
        ], 201);
    }

    /**
     * Professor: Supprimer une absence (si pas encore justifiée)
     */
    public function destroyAbsence($id)
    {
        $professor = auth()->user();
        $moduleIds = $professor->modules()->pluck('modules.id');

        $absence = Absence::whereIn('module_id', $moduleIds)
            ->where('id', $id)
            ->firstOrFail();

        // Ne pas supprimer si déjà justifiée
        if ($absence->est_justifie) {
            return response()->json([
                'message' => 'Impossible de supprimer une absence déjà justifiée'
            ], 422);
        }

        // Supprimer le fichier justificatif s'il existe
        if ($absence->justification_file) {
            Storage::delete($absence->justification_file);
        }

        $absence->delete();

        return response()->json(['message' => 'Absence supprimée avec succès']);
    }

    /**
     * Student: Upload justificatif d'absence
     */
    public function uploadJustificatif(Request $request, $id)
    {
        $request->validate([
            'justificatif' => 'required|file|mimes:pdf,jpg,jpeg,png|max:2048',
        ]);

        $absence = Absence::where('student_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        // Supprimer l'ancien fichier s'il existe
        if ($absence->justification_file) {
            Storage::delete($absence->justification_file);
        }

        // Stocker le nouveau fichier
        $path = $request->file('justificatif')->store('justificatifs');

        $absence->update([
            'justification_file' => $path,
            'est_justifie' => false,
            'statut_justification' => 'pending',
            'motif_rejet' => null,
        ]);

        return response()->json([
            'message' => 'Justificatif déposé avec succès',
            'absence' => $absence->load(['module'])
        ]);
    }
}
