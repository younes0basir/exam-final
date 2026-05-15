<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Absence extends Model
{
    protected $fillable = [
        'student_id',
        'module_id',
        'date_absence',
        'seance_debut',
        'seance_fin',
        'est_justifie',
        'justification_file',
        'statut_justification',
        'motif_rejet',
    ];

    protected $casts = [
        'est_justifie' => 'boolean',
        'date_absence' => 'date',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }
}
