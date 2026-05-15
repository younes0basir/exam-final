<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Groupe extends Model
{
    protected $table = 'groupes';

    protected $fillable = ['nom', 'filiere_id'];

    public function filiere()
    {
        return $this->belongsTo(Filiere::class, 'filiere_id');
    }

    public function students()
    {
        return $this->belongsToMany(User::class, 'student_group', 'group_id', 'student_id');
    }

    public function emploisDuTemps()
    {
        return $this->hasMany(EmploiDuTemps::class, 'groupe_id');
    }
}
