<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\DemandeAdministrative;
use App\Models\User;
use App\Models\Note;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;

class DocumentController extends Controller
{
    /**
     * Générer le PDF d'une demande administrative validée
     */
    public function generateDocument($demandeId)
    {
        $demande = DemandeAdministrative::with('user')->findOrFail($demandeId);

        // Vérifier que la demande est validée
        if ($demande->statut !== 'validated') {
            return response()->json([
                'message' => 'Cette demande n\'a pas encore été validée'
            ], 422);
        }

        // Vérifier les permissions
        $user = auth()->user();
        if ($user->role !== 'admin' && $user->id !== $demande->user_id) {
            return response()->json([
                'message' => 'Vous n\'avez pas accès à ce document'
            ], 403);
        }

        switch ($demande->type) {
            case 'Attestation de scolarité':
                return $this->generateAttestationScolarite($demande);
            case 'Relevé de notes':
                return $this->generateReleveNotes($demande);
            case 'Certificat d\'inscription':
                return $this->generateCertificatInscription($demande);
            case 'Attestation de travail':
                return $this->generateAttestationTravail($demande);
            case 'Ordre de mission':
                return $this->generateOrdreMission($demande);
            default:
                return response()->json([
                    'message' => 'Type de document non supporté'
                ], 400);
        }
    }

    /**
     * Générer une attestation de scolarité
     */
    private function generateAttestationScolarite($demande)
    {
        $user = $demande->user;
        $groups = $user->groups()->with('filiere')->first();
        $filiere = $groups ? $groups->filiere : null;

        $data = [
            'title' => 'Attestation de Scolarité',
            'document_type' => 'attestation_scolarite',
            'user' => $user,
            'filiere' => $filiere,
            'groupe' => $groups,
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'reference' => 'UPF/ATT/' . date('Y') . '/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.attestation_scolarite', $data);

        return $pdf->download('attestation_scolarite_' . $user->name . '.pdf');
    }

    /**
     * Générer un relevé de notes
     */
    private function generateReleveNotes($demande)
    {
        $user = $demande->user;
        $notes = Note::with('module')
            ->where('student_id', $user->id)
            ->whereNotNull('note_finale')
            ->get();

        $moyenneGenerale = $notes->avg('note_finale');

        $data = [
            'title' => 'Relevé de Notes',
            'document_type' => 'releve_notes',
            'user' => $user,
            'notes' => $notes,
            'moyenne_generale' => round($moyenneGenerale, 2),
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'reference' => 'UPF/REL/' . date('Y') . '/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.releve_notes', $data);

        return $pdf->download('releve_notes_' . $user->name . '.pdf');
    }

    /**
     * Générer un certificat d'inscription
     */
    private function generateCertificatInscription($demande)
    {
        $user = $demande->user;
        $groups = $user->groups()->with('filiere')->first();
        $filiere = $groups ? $groups->filiere : null;

        $data = [
            'title' => 'Certificat d\'Inscription',
            'document_type' => 'certificat_inscription',
            'user' => $user,
            'filiere' => $filiere,
            'groupe' => $groups,
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'annee_universitaire' => date('Y') . '-' . (date('Y') + 1),
            'reference' => 'UPF/CERT/' . date('Y') . '/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.certificat_inscription', $data);

        return $pdf->download('certificat_inscription_' . $user->name . '.pdf');
    }

    /**
     * Générer une attestation de travail (professeur)
     */
    private function generateAttestationTravail($demande)
    {
        $user = $demande->user;
        $modules = $user->modules;

        $data = [
            'title' => 'Attestation de Travail',
            'document_type' => 'attestation_travail',
            'user' => $user,
            'modules' => $modules,
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'reference' => 'UPF/ATT-TR/' . date('Y') . '/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.attestation_travail', $data);

        return $pdf->download('attestation_travail_' . $user->name . '.pdf');
    }

    /**
     * Générer un ordre de mission (professeur)
     */
    private function generateOrdreMission($demande)
    {
        $user = $demande->user;

        $data = [
            'title' => 'Ordre de Mission',
            'document_type' => 'ordre_mission',
            'user' => $user,
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'reference' => 'UPF/OM/' . date('Y') . '/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.ordre_mission', $data);

        return $pdf->download('ordre_mission_' . $user->name . '.pdf');
    }

    /**
     * Générer un PDF de test (preview)
     */
    public function previewDocument($demandeId)
    {
        $demande = DemandeAdministrative::with('user')->findOrFail($demandeId);

        // Seul l'admin peut prévisualiser
        if (auth()->user()->role !== 'admin') {
            return response()->json([
                'message' => 'Accès réservé aux administrateurs'
            ], 403);
        }

        $user = $demande->user;
        $groups = $user->groups()->with('filiere')->first();
        $filiere = $groups ? $groups->filiere : null;

        $data = [
            'title' => 'Aperçu du Document',
            'user' => $user,
            'filiere' => $filiere,
            'groupe' => $groups,
            'demande' => $demande,
            'date_emission' => Carbon::now()->format('d/m/Y'),
            'reference' => 'UPF/PREVIEW/' . str_pad($demande->id, 5, '0', STR_PAD_LEFT),
        ];

        $pdf = PDF::loadView('documents.preview', $data);

        return $pdf->stream('preview.pdf');
    }
}
