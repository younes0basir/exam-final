<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Note extends Model
{
    protected $fillable = [
        'student_id',
        'module_id',
        'cc1',
        'cc2',
        'examen',
        'note_finale',
    ];

    public function student(): BelongsTo {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function module(): BelongsTo {
        return $this->belongsTo(Module::class);
    }
}
