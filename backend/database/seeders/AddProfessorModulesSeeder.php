<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Module;
use App\Models\Filiere;
use App\Models\User;
use App\Models\Groupe;
use DB;

class AddProfessorModulesSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $professorId = 23;
        
        // Get or create a filiere for the modules
        $filiere = Filiere::firstOrCreate(
            ['code' => 'INFO'],
            ['nom' => 'Informatique']
        );

        // Create new modules
        $modules = [
            ['nom' => 'Algorithmique Avancée', 'filiere_id' => $filiere->id],
            ['nom' => 'Base de Données Avancée', 'filiere_id' => $filiere->id],
            ['nom' => 'Développement Web', 'filiere_id' => $filiere->id],
            ['nom' => 'Systèmes d\'Exploitation', 'filiere_id' => $filiere->id],
            ['nom' => 'Réseaux Informatiques', 'filiere_id' => $filiere->id],
            ['nom' => 'Intelligence Artificielle', 'filiere_id' => $filiere->id],
            ['nom' => 'Sécurité Informatique', 'filiere_id' => $filiere->id],
            ['nom' => 'Cloud Computing', 'filiere_id' => $filiere->id],
        ];

        $createdModules = [];
        foreach ($modules as $moduleData) {
            $module = Module::create($moduleData);
            $createdModules[] = $module;
            
            // Assign module to professor
            DB::table('module_professor')->insert([
                'module_id' => $module->id,
                'professor_id' => $professorId,
            ]);
        }

        // Get existing students to assign to professor's modules
        $students = User::where('role', 'student')->limit(20)->get();
        
        // Create a group for this filiere if it doesn't exist
        $group = Groupe::firstOrCreate(
            ['nom' => 'Groupe INFO 1', 'filiere_id' => $filiere->id],
            ['created_at' => now(), 'updated_at' => now()]
        );

        // Assign students to the group (which gives them access to the filiere's modules)
        foreach ($students as $student) {
            DB::table('student_group')->insertOrIgnore([
                'student_id' => $student->id,
                'group_id' => $group->id,
            ]);
        }

        $this->command->info('Successfully added ' . count($createdModules) . ' modules to professor ID ' . $professorId);
        $this->command->info('Assigned ' . $students->count() . ' students to the filiere');
    }
}
