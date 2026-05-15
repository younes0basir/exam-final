<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CahierTexte extends Model
{
    protected $table = 'cahier_textes';

    protected $fillable = [
        'prof_id',
        'module_id',
        'groupe_id',
        'date_seance',
        'heure_debut',
        'heure_fin',
        'objectif',
        'nature',
    ];

    protected $casts = [
        'date_seance' => 'date',
    ];

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function groupe(): BelongsTo
    {
        return $this->belongsTo(Groupe::class, 'groupe_id');
    }
}
