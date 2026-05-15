<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class ClassroomAnnonce extends Model
{
    protected $table = 'classroom_annonces';

    protected $fillable = [
        'module_id',
        'prof_id',
        'titre',
        'contenu',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id');
    }

    public function commentaires(): HasMany
    {
        return $this->hasMany(ClassroomCommentaire::class, 'annonce_id');
    }
}
