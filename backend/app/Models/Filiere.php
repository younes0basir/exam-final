<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Filiere extends Model
{
    protected $table = 'filieres';

    protected $fillable = ['nom', 'code', 'description'];

    public function modules()
    {
        return $this->hasMany(Module::class, 'filiere_id');
    }

    public function groupes()
    {
        return $this->hasMany(Groupe::class, 'filiere_id');
    }
}
