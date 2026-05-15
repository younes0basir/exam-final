<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ReservationSalle extends Model
{
    protected $table = 'reservations_salles';

    protected $fillable = [
        'salle_id',
        'prof_id',
        'date_reservation',
        'heure_debut',
        'heure_fin',
        'motif',
        'statut',
    ];

    protected $casts = [
        'date_reservation' => 'date',
    ];

    public function salle(): BelongsTo
    {
        return $this->belongsTo(Salle::class, 'salle_id');
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id');
    }
}
