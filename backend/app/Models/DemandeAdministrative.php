<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DemandeAdministrative extends Model
{
    protected $table = 'demandes_administratives';

    protected $fillable = [
        'user_id',
        'type',
        'motif',
        'statut',
        'motif_rejet',
        'document_path'
    ];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_id');
    }
}
