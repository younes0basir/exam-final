<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassroomCommentaire extends Model
{
    protected $table = 'classroom_commentaires';

    protected $fillable = [
        'annonce_id',
        'user_id',
        'contenu',
    ];

    public function annonce(): BelongsTo
    {
        return $this->belongsTo(ClassroomAnnonce::class, 'annonce_id');
    }

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }
}
