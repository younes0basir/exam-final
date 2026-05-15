<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ClassroomAnnonce;
use App\Models\ClassroomCommentaire;
use App\Models\ClassroomDocument;
use App\Models\Module;
use Illuminate\Support\Facades\Storage;

class ClassroomController extends Controller
{
    /**
     * Admin: Toutes les annonces
     */
    public function allAnnonces(Request $request)
    {
        $query = ClassroomAnnonce::with(['module', 'professor'])->latest();

        if ($request->has('module_id')) {
            $query->where('module_id', $request->module_id);
        }

        $annonces = $query->paginate(20);
        return response()->json($annonces);
    }

    /**
     * Professor: Ses annonces
     */
    public function professorAnnonces()
    {
        $annonces = ClassroomAnnonce::where('prof_id', auth()->id())
            ->with(['module', 'commentaires.user'])
            ->latest()
            ->paginate(20);

        return response()->json($annonces);
    }

    /**
     * Professor: Modules pour lesquels il peut créer des annonces
     */
    public function professorModules()
    {
        $modules = auth()->user()->modules()->with('filiere')->get();
        return response()->json($modules);
    }

    /**
     * Professor: Créer une annonce
     */
    public function storeAnnonce(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'titre' => 'required|string|max:255',
            'contenu' => 'required|string',
        ]);

        // Vérifier que le professeur enseigne ce module
        $professor = auth()->user();
        $teachesModule = $professor->modules()->where('modules.id', $request->module_id)->exists();

        if (!$teachesModule) {
            return response()->json([
                'message' => 'Vous ne pouvez pas créer d\'annonce pour ce module'
            ], 403);
        }

        $annonce = ClassroomAnnonce::create([
            'module_id' => $request->module_id,
            'prof_id' => auth()->id(),
            'titre' => $request->titre,
            'contenu' => $request->contenu,
        ]);

        return response()->json([
            'message' => 'Annonce créée avec succès',
            'annonce' => $annonce->load(['module', 'professor'])
        ], 201);
    }

    /**
     * Professor: Supprimer son annonce
     */
    public function deleteAnnonce($id)
    {
        $annonce = ClassroomAnnonce::where('prof_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        // Supprimer les commentaires associés
        $annonce->commentaires()->delete();

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée avec succès']);
    }

    /**
     * Admin: Supprimer une annonce
     */
    public function adminDeleteAnnonce($id)
    {
        $annonce = ClassroomAnnonce::findOrFail($id);

        // Supprimer les commentaires associés
        $annonce->commentaires()->delete();

        $annonce->delete();

        return response()->json(['message' => 'Annonce supprimée avec succès']);
    }

    /**
     * Student: Annonces de ses modules
     */
    public function studentAnnonces()
    {
        $user = auth()->user();
        $filiereIds = $user->groups()->pluck('filieres.id');
        $moduleIds = Module::whereIn('filiere_id', $filiereIds)->pluck('id');

        $annonces = ClassroomAnnonce::whereIn('module_id', $moduleIds)
            ->with(['module', 'professor', 'commentaires.user'])
            ->latest()
            ->paginate(20);

        return response()->json($annonces);
    }

    /**
     * Récupérer les commentaires d'une annonce
     */
    public function getCommentaires($annonceId)
    {
        $annonce = ClassroomAnnonce::findOrFail($annonceId);

        $commentaires = $annonce->commentaires()
            ->with('user')
            ->oldest()
            ->get();

        return response()->json($commentaires);
    }

    /**
     * Ajouter un commentaire à une annonce
     */
    public function storeCommentaire(Request $request, $annonceId)
    {
        $request->validate([
            'contenu' => 'required|string|max:1000',
        ]);

        $annonce = ClassroomAnnonce::findOrFail($annonceId);

        // Vérifier que l'utilisateur a accès à cette annonce (étudiant du module ou professeur)
        $user = auth()->user();
        $hasAccess = false;

        if ($user->role === 'student') {
            $filiereIds = $user->groups()->pluck('filieres.id');
            $moduleIds = Module::whereIn('filiere_id', $filiereIds)->pluck('id');
            $hasAccess = in_array($annonce->module_id, $moduleIds->toArray());
        } elseif ($user->role === 'professor') {
            $hasAccess = $annonce->prof_id === $user->id ||
                        $user->modules()->where('modules.id', $annonce->module_id)->exists();
        } else {
            $hasAccess = true; // admin
        }

        if (!$hasAccess) {
            return response()->json([
                'message' => 'Vous n\'avez pas accès à cette annonce'
            ], 403);
        }

        $commentaire = ClassroomCommentaire::create([
            'annonce_id' => $annonceId,
            'user_id' => auth()->id(),
            'contenu' => $request->contenu,
        ]);

        return response()->json([
            'message' => 'Commentaire ajouté avec succès',
            'commentaire' => $commentaire->load('user')
        ], 201);
    }

    /**
     * Admin: Supprimer un commentaire
     */
    public function adminDeleteCommentaire($id)
    {
        $commentaire = ClassroomCommentaire::findOrFail($id);
        $commentaire->delete();

        return response()->json(['message' => 'Commentaire supprimé avec succès']);
    }

    /**
     * Professor: Déposer un document
     */
    public function storeDocument(Request $request)
    {
        $request->validate([
            'module_id' => 'required|exists:modules,id',
            'titre' => 'required|string|max:255',
            'type' => 'required|in:Cours,TD,TP,Autre',
            'document' => 'required|file|mimes:pdf,doc,docx,ppt,pptx|max:10240',
        ]);

        // Vérifier que le professeur enseigne ce module
        $professor = auth()->user();
        $teachesModule = $professor->modules()->where('modules.id', $request->module_id)->exists();

        if (!$teachesModule) {
            return response()->json([
                'message' => 'Vous ne pouvez pas déposer de document pour ce module'
            ], 403);
        }

        // Stocker le fichier
        $path = $request->file('document')->store('documents');

        $document = ClassroomDocument::create([
            'module_id' => $request->module_id,
            'prof_id' => auth()->id(),
            'titre' => $request->titre,
            'file_path' => $path,
            'type' => $request->type,
        ]);

        return response()->json([
            'message' => 'Document déposé avec succès',
            'document' => $document->load(['module', 'professor'])
        ], 201);
    }

    /**
     * Professor: Supprimer un document
     */
    public function deleteDocument($id)
    {
        $document = ClassroomDocument::where('prof_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        // Supprimer le fichier
        Storage::delete($document->file_path);

        $document->delete();

        return response()->json(['message' => 'Document supprimé avec succès']);
    }
}
