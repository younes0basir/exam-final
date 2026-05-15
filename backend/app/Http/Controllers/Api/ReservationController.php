<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\ReservationSalle;
use App\Models\Salle;
use App\Models\EmploiDuTemps;
use Carbon\Carbon;

class ReservationController extends Controller
{
    /**
     * Liste des réservations du professeur connecté
     */
    public function index()
    {
        $reservations = ReservationSalle::where('prof_id', auth()->id())
            ->with(['salle'])
            ->latest()
            ->paginate(20);

        return response()->json($reservations);
    }

    /**
     * Liste de toutes les réservations (pour admin)
     */
    public function allReservations()
    {
        $reservations = ReservationSalle::with(['salle', 'professor'])
            ->latest()
            ->paginate(20);

        return response()->json($reservations);
    }

    /**
     * Consultation des disponibilités d'une salle
     */
    public function disponibilites(Request $request)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date' => 'required|date',
        ]);

        $salleId = $request->salle_id;
        $date = $request->date;
        $jourSemaine = Carbon::parse($date)->locale('fr')->dayName;
        $jourSemaine = ucfirst($jourSemaine);

        // Récupérer les séances d'emploi du temps pour ce jour
        $seancesEdt = EmploiDuTemps::where('salle_id', $salleId)
            ->where('jour', $jourSemaine)
            ->with(['module', 'professor', 'groupe'])
            ->get()
            ->map(function ($seance) use ($date) {
                return [
                    'type' => 'emploi_du_temps',
                    'heure_debut' => $seance->heure_debut,
                    'heure_fin' => $seance->heure_fin,
                    'module' => $seance->module->nom ?? null,
                    'professeur' => $seance->professor->name ?? null,
                    'groupe' => $seance->groupe->nom ?? null,
                ];
            });

        // Récupérer les réservations validées pour cette date
        $reservations = ReservationSalle::where('salle_id', $salleId)
            ->where('date_reservation', $date)
            ->where('statut', 'validated')
            ->with(['professor'])
            ->get()
            ->map(function ($reservation) {
                return [
                    'type' => 'reservation',
                    'heure_debut' => $reservation->heure_debut,
                    'heure_fin' => $reservation->heure_fin,
                    'professeur' => $reservation->professor->name ?? null,
                    'motif' => $reservation->motif,
                ];
            });

        $disponibilites = $seancesEdt->merge($reservations)->sortBy('heure_debut')->values();

        return response()->json([
            'salle_id' => $salleId,
            'date' => $date,
            'jour' => $jourSemaine,
            'occupations' => $disponibilites,
        ]);
    }

    /**
     * Créer une nouvelle réservation (professeur)
     */
    public function store(Request $request)
    {
        $request->validate([
            'salle_id' => 'required|exists:salles,id',
            'date_reservation' => 'required|date|after_or_equal:today',
            'heure_debut' => 'required|date_format:H:i',
            'heure_fin' => 'required|date_format:H:i|after:heure_debut',
            'motif' => 'nullable|string|max:500',
        ]);

        // Vérifier les conflits avec l'emploi du temps
        $jourSemaine = Carbon::parse($request->date_reservation)->locale('fr')->dayName;
        $jourSemaine = ucfirst($jourSemaine);

        $conflitEdt = EmploiDuTemps::where('salle_id', $request->salle_id)
            ->where('jour', $jourSemaine)
            ->where(function ($query) use ($request) {
                $query->whereBetween('heure_debut', [$request->heure_debut, $request->heure_fin])
                    ->orWhereBetween('heure_fin', [$request->heure_debut, $request->heure_fin])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('heure_debut', '<=', $request->heure_debut)
                            ->where('heure_fin', '>=', $request->heure_fin);
                    });
            })
            ->first();

        if ($conflitEdt) {
            return response()->json([
                'message' => 'Conflit avec l\'emploi du temps',
                'conflit' => [
                    'module' => $conflitEdt->module->nom ?? null,
                    'heure_debut' => $conflitEdt->heure_debut,
                    'heure_fin' => $conflitEdt->heure_fin,
                ]
            ], 422);
        }

        // Vérifier les conflits avec d'autres réservations validées
        $conflitReservation = ReservationSalle::where('salle_id', $request->salle_id)
            ->where('date_reservation', $request->date_reservation)
            ->where('statut', 'validated')
            ->where(function ($query) use ($request) {
                $query->whereBetween('heure_debut', [$request->heure_debut, $request->heure_fin])
                    ->orWhereBetween('heure_fin', [$request->heure_debut, $request->heure_fin])
                    ->orWhere(function ($q) use ($request) {
                        $q->where('heure_debut', '<=', $request->heure_debut)
                            ->where('heure_fin', '>=', $request->heure_fin);
                    });
            })
            ->first();

        if ($conflitReservation) {
            return response()->json([
                'message' => 'Conflit avec une autre réservation',
                'conflit' => [
                    'professeur' => $conflitReservation->professor->name ?? null,
                    'heure_debut' => $conflitReservation->heure_debut,
                    'heure_fin' => $conflitReservation->heure_fin,
                ]
            ], 422);
        }

        $reservation = ReservationSalle::create([
            'salle_id' => $request->salle_id,
            'prof_id' => auth()->id(),
            'date_reservation' => $request->date_reservation,
            'heure_debut' => $request->heure_debut,
            'heure_fin' => $request->heure_fin,
            'motif' => $request->motif,
            'statut' => 'pending',
        ]);

        return response()->json([
            'message' => 'Demande de réservation soumise avec succès',
            'reservation' => $reservation->load('salle')
        ], 201);
    }

    /**
     * Annuler sa propre réservation (professeur)
     */
    public function destroy($id)
    {
        $reservation = ReservationSalle::where('id', $id)
            ->where('prof_id', auth()->id())
            ->firstOrFail();

        $reservation->delete();

        return response()->json(['message' => 'Réservation annulée avec succès']);
    }

    /**
     * Valider/Refuser une réservation (admin)
     */
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'statut' => 'required|in:validated,rejected',
        ]);

        $reservation = ReservationSalle::findOrFail($id);

        // Si validation, revérifier les conflits
        if ($request->statut === 'validated') {
            $jourSemaine = Carbon::parse($reservation->date_reservation)->locale('fr')->dayName;
            $jourSemaine = ucfirst($jourSemaine);

            $conflitEdt = EmploiDuTemps::where('salle_id', $reservation->salle_id)
                ->where('jour', $jourSemaine)
                ->where(function ($query) use ($reservation) {
                    $query->whereBetween('heure_debut', [$reservation->heure_debut, $reservation->heure_fin])
                        ->orWhereBetween('heure_fin', [$reservation->heure_debut, $reservation->heure_fin]);
                })
                ->first();

            $conflitReservation = ReservationSalle::where('salle_id', $reservation->salle_id)
                ->where('date_reservation', $reservation->date_reservation)
                ->where('statut', 'validated')
                ->where('id', '!=', $id)
                ->where(function ($query) use ($reservation) {
                    $query->whereBetween('heure_debut', [$reservation->heure_debut, $reservation->heure_fin])
                        ->orWhereBetween('heure_fin', [$reservation->heure_debut, $reservation->heure_fin]);
                })
                ->first();

            if ($conflitEdt || $conflitReservation) {
                return response()->json([
                    'message' => 'Impossible de valider: conflit détecté'
                ], 422);
            }
        }

        $reservation->update(['statut' => $request->statut]);

        return response()->json([
            'message' => 'Statut mis à jour avec succès',
            'reservation' => $reservation
        ]);
    }

    /**
     * Admin: Modifier une réservation
     */
    public function update(Request $request, $id)
    {
        $request->validate([
            'salle_id' => 'sometimes|exists:salles,id',
            'date_reservation' => 'sometimes|date',
            'heure_debut' => 'sometimes|date_format:H:i',
            'heure_fin' => 'sometimes|date_format:H:i|after:heure_debut',
            'motif' => 'nullable|string|max:500',
        ]);

        $reservation = ReservationSalle::findOrFail($id);

        $reservation->update($request->only([
            'salle_id', 'date_reservation', 'heure_debut', 'heure_fin', 'motif'
        ]));

        return response()->json([
            'message' => 'Réservation modifiée avec succès',
            'reservation' => $reservation->load(['salle', 'professor'])
        ]);
    }

    /**
     * Admin: Supprimer une réservation
     */
    public function adminDestroy($id)
    {
        $reservation = ReservationSalle::findOrFail($id);
        $reservation->delete();

        return response()->json(['message' => 'Réservation supprimée avec succès']);
    }

    /**
     * Liste des salles disponibles
     */
    public function salles()
    {
        $salles = Salle::all();
        return response()->json($salles);
    }
}
