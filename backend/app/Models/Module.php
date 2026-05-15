<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $table = 'modules';

    protected $fillable = ['nom', 'filiere_id'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }

    public function professors()
    {
        return $this->belongsToMany(User::class, 'module_professor', 'module_id', 'professor_id');
    }

    public function documents()
    {
        return $this->hasMany(ClassroomDocument::class);
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class);
    }
}
