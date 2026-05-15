<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class ClassroomDocument extends Model
{
    protected $fillable = [
        'module_id',
        'prof_id',
        'titre',
        'file_path',
        'type',
    ];

    public function module(): BelongsTo
    {
        return $this->belongsTo(Module::class);
    }

    public function professor(): BelongsTo
    {
        return $this->belongsTo(User::class, 'prof_id');
    }
}
