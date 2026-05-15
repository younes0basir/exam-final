<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;


class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create Admin
        User::factory()->create([
            'name' => 'Admin UPF',
            'email' => 'admin@upf.ma',
            'password' => bcrypt('password'),
            'role' => 'admin',
        ]);

        // Create Professors
        $prof1 = User::factory()->create([
            'name' => 'Dr. Ahmed Bennani',
            'email' => 'a.bennani@upf.ma',
            'password' => bcrypt('password'),
            'role' => 'professor',
        ]);

        $prof2 = User::factory()->create([
            'name' => 'Prof. Fatima Zahra Idrissi',
            'email' => 'f.idrissi@upf.ma',
            'password' => bcrypt('password'),
            'role' => 'professor',
        ]);

        $prof3 = User::factory()->create([
            'name' => 'Dr. Karim Tazi',
            'email' => 'k.tazi@upf.ma',
            'password' => bcrypt('password'),
            'role' => 'professor',
        ]);

        // Seed Filieres
        $filiereInfoId = DB::table('filieres')->insertGetId([
            'nom' => 'Génie Informatique',
            'code' => 'GINFO',
            'description' => 'Formation en informatique et technologies numériques',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $filiereGseId = DB::table('filieres')->insertGetId([
            'nom' => 'Génie Systèmes Embarqués',
            'code' => 'GSE',
            'description' => 'Formation en systèmes embarqués et IoT',
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Groupes
        $groupeGinfo3aId = DB::table('groupes')->insertGetId([
            'nom' => 'GINFO3A',
            'filiere_id' => $filiereInfoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $groupeGinfo3bId = DB::table('groupes')->insertGetId([
            'nom' => 'GINFO3B',
            'filiere_id' => $filiereInfoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $groupeGse3aId = DB::table('groupes')->insertGetId([
            'nom' => 'GSE3A',
            'filiere_id' => $filiereGseId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Modules
        $moduleWebId = DB::table('modules')->insertGetId([
            'nom' => 'Technologie Web 2',
            'filiere_id' => $filiereInfoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $moduleReseauxId = DB::table('modules')->insertGetId([
            'nom' => 'Réseaux Informatiques',
            'filiere_id' => $filiereInfoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $moduleIAId = DB::table('modules')->insertGetId([
            'nom' => 'Intelligence Artificielle',
            'filiere_id' => $filiereInfoId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        $moduleIoTId = DB::table('modules')->insertGetId([
            'nom' => 'Internet des Objets',
            'filiere_id' => $filiereGseId,
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Assign professors to modules
        DB::table('module_professor')->insert([
            ['module_id' => $moduleWebId, 'professor_id' => $prof1->id],
            ['module_id' => $moduleReseauxId, 'professor_id' => $prof2->id],
            ['module_id' => $moduleIAId, 'professor_id' => $prof3->id],
            ['module_id' => $moduleIoTId, 'professor_id' => $prof1->id],
        ]);

        // Seed Salles
        DB::table('salles')->insert([
            ['nom' => 'Salle 101', 'capacite' => 30, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Salle 102', 'capacite' => 30, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Salle 201', 'capacite' => 35, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Amphi A', 'capacite' => 100, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Labo Info 1', 'capacite' => 20, 'created_at' => now(), 'updated_at' => now()],
            ['nom' => 'Labo Info 2', 'capacite' => 20, 'created_at' => now(), 'updated_at' => now()],
        ]);

        // Create Students for GINFO3A
        $studentsGinfo3a = [
            ['Youssef Alami', 'y.alami@student.upf.ma'],
            ['Amina Benkirane', 'a.benkirane@student.upf.ma'],
            ['Omar Chaoui', 'o.chaoui@student.upf.ma'],
            ['Salma Derraj', 's.derraj@student.upf.ma'],
            ['Hamza El Fassi', 'h.elfassi@student.upf.ma'],
            ['Imane Guessous', 'i.guessous@student.upf.ma'],
            ['Mehdi Hajji', 'm.hajji@student.upf.ma'],
            ['Nadia Iraqi', 'n.iraqi@student.upf.ma'],
        ];

        foreach ($studentsGinfo3a as $student) {
            $studentId = User::factory()->create([
                'name' => $student[0],
                'email' => $student[1],
                'password' => bcrypt('password'),
                'role' => 'student',
            ])->id;

            DB::table('student_group')->insert([
                'student_id' => $studentId,
                'group_id' => $groupeGinfo3aId,
            ]);
        }

        // Create Students for GINFO3B
        $studentsGinfo3b = [
            ['Rachid Kabbaj', 'r.kabbaj@student.upf.ma'],
            ['Leila Mansouri', 'l.mansouri@student.upf.ma'],
            ['Ayoub Naji', 'a.naji@student.upf.ma'],
            ['Bouchra Ouazzani', 'b.ouazzani@student.upf.ma'],
            ['Zakaria Rahmani', 'z.rahmani@student.upf.ma'],
            ['Hajar Saadi', 'h.saadi@student.upf.ma'],
            ['Ismail Tahiri', 'i.tahiri@student.upf.ma'],
            ['Khadija Ziani', 'k.ziani@student.upf.ma'],
        ];

        foreach ($studentsGinfo3b as $student) {
            $studentId = User::factory()->create([
                'name' => $student[0],
                'email' => $student[1],
                'password' => bcrypt('password'),
                'role' => 'student',
            ])->id;

            DB::table('student_group')->insert([
                'student_id' => $studentId,
                'group_id' => $groupeGinfo3bId,
            ]);
        }

        // Get student IDs for grades
        $ginfo3aStudents = DB::table('student_group')
            ->where('group_id', $groupeGinfo3aId)
            ->pluck('student_id');

        $ginfo3bStudents = DB::table('student_group')
            ->where('group_id', $groupeGinfo3bId)
            ->pluck('student_id');

        // Seed Grades for Technologie Web 2 (GINFO3A)
        // Formule obligatoire: Note finale = ((CC1 + CC2) / 2) × 0.4 + Examen × 0.6
        foreach ($ginfo3aStudents as $index => $studentId) {
            $cc1 = rand(10, 18);
            $cc2 = rand(10, 18);
            $examen = rand(10, 19);
            $finale = round((($cc1 + $cc2) / 2) * 0.4 + $examen * 0.6, 2);

            DB::table('notes')->insert([
                'student_id' => $studentId,
                'module_id' => $moduleWebId,
                'cc1' => $cc1,
                'cc2' => $cc2,
                'examen' => $examen,
                'note_finale' => $finale,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Grades for Réseaux Informatiques (GINFO3B)
        foreach ($ginfo3bStudents as $index => $studentId) {
            $cc1 = rand(8, 17);
            $cc2 = rand(9, 18);
            $examen = rand(10, 18);
            $finale = round((($cc1 + $cc2) / 2) * 0.4 + $examen * 0.6, 2);

            DB::table('notes')->insert([
                'student_id' => $studentId,
                'module_id' => $moduleReseauxId,
                'cc1' => $cc1,
                'cc2' => $cc2,
                'examen' => $examen,
                'note_finale' => $finale,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Emplois du Temps for GINFO3A - Complete Weekly Schedule
        $scheduleGinfo3a = [
            // Monday
            ['Lundi', '08:30:00', '10:30:00', $moduleWebId, $prof1->id, 1],
            ['Lundi', '10:30:00', '12:30:00', $moduleReseauxId, $prof2->id, 2],
            ['Lundi', '14:00:00', '16:00:00', $moduleIAId, $prof3->id, 5],
            
            // Tuesday
            ['Mardi', '08:30:00', '10:30:00', $moduleIAId, $prof3->id, 3],
            ['Mardi', '10:30:00', '12:30:00', $moduleWebId, $prof1->id, 6],
            
            // Wednesday
            ['Mercredi', '08:30:00', '10:30:00', $moduleReseauxId, $prof2->id, 1],
            ['Mercredi', '14:00:00', '16:00:00', $moduleWebId, $prof1->id, 5],
            
            // Thursday
            ['Jeudi', '08:30:00', '10:30:00', $moduleIAId, $prof3->id, 2],
            ['Jeudi', '10:30:00', '12:30:00', $moduleReseauxId, $prof2->id, 6],
            ['Jeudi', '14:00:00', '16:00:00', $moduleWebId, $prof1->id, 3],
            
            // Friday
            ['Vendredi', '08:30:00', '10:30:00', $moduleReseauxId, $prof2->id, 1],
            ['Vendredi', '10:30:00', '12:30:00', $moduleIAId, $prof3->id, 5],
        ];

        foreach ($scheduleGinfo3a as $session) {
            DB::table('emplois_du_temps')->insert([
                'groupe_id' => $groupeGinfo3aId,
                'module_id' => $session[3],
                'prof_id' => $session[4],
                'salle_id' => $session[5],
                'jour' => $session[0],
                'heure_debut' => $session[1],
                'heure_fin' => $session[2],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Emplois du Temps for GINFO3B - Complete Weekly Schedule
        $scheduleGinfo3b = [
            // Monday
            ['Lundi', '08:30:00', '10:30:00', $moduleReseauxId, $prof2->id, 2],
            ['Lundi', '10:30:00', '12:30:00', $moduleIAId, $prof3->id, 3],
            ['Lundi', '14:00:00', '16:00:00', $moduleWebId, $prof1->id, 1],
            
            // Tuesday
            ['Mardi', '08:30:00', '10:30:00', $moduleWebId, $prof1->id, 6],
            ['Mardi', '14:00:00', '16:00:00', $moduleReseauxId, $prof2->id, 5],
            
            // Wednesday
            ['Mercredi', '08:30:00', '10:30:00', $moduleIAId, $prof3->id, 2],
            ['Mercredi', '10:30:00', '12:30:00', $moduleWebId, $prof1->id, 1],
            ['Mercredi', '14:00:00', '16:00:00', $moduleReseauxId, $prof2->id, 6],
            
            // Thursday
            ['Jeudi', '08:30:00', '10:30:00', $moduleIAId, $prof3->id, 3],
            ['Jeudi', '10:30:00', '12:30:00', $moduleWebId, $prof1->id, 2],
            
            // Friday
            ['Vendredi', '08:30:00', '10:30:00', $moduleReseauxId, $prof2->id, 5],
            ['Vendredi', '10:30:00', '12:30:00', $moduleIAId, $prof3->id, 1],
            ['Vendredi', '14:00:00', '16:00:00', $moduleWebId, $prof1->id, 6],
        ];

        foreach ($scheduleGinfo3b as $session) {
            DB::table('emplois_du_temps')->insert([
                'groupe_id' => $groupeGinfo3bId,
                'module_id' => $session[3],
                'prof_id' => $session[4],
                'salle_id' => $session[5],
                'jour' => $session[0],
                'heure_debut' => $session[1],
                'heure_fin' => $session[2],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Emplois du Temps for GSE3A - Complete Weekly Schedule
        $scheduleGse3a = [
            // Monday
            ['Lundi', '08:30:00', '10:30:00', $moduleIoTId, $prof1->id, 3],
            ['Lundi', '14:00:00', '16:00:00', $moduleWebId, $prof1->id, 5],
            
            // Tuesday
            ['Mardi', '08:30:00', '10:30:00', $moduleIoTId, $prof1->id, 6],
            ['Mardi', '10:30:00', '12:30:00', $moduleReseauxId, $prof2->id, 2],
            ['Mardi', '14:00:00', '16:00:00', $moduleIAId, $prof3->id, 1],
            
            // Wednesday
            ['Mercredi', '08:30:00', '10:30:00', $moduleWebId, $prof1->id, 3],
            ['Mercredi', '10:30:00', '12:30:00', $moduleIoTId, $prof1->id, 5],
            
            // Thursday
            ['Jeudi', '08:30:00', '10:30:00', $moduleReseauxId, $prof2->id, 2],
            ['Jeudi', '14:00:00', '16:00:00', $moduleIAId, $prof3->id, 6],
            
            // Friday
            ['Vendredi', '08:30:00', '10:30:00', $moduleWebId, $prof1->id, 1],
            ['Vendredi', '10:30:00', '12:30:00', $moduleIoTId, $prof1->id, 3],
        ];

        foreach ($scheduleGse3a as $session) {
            DB::table('emplois_du_temps')->insert([
                'groupe_id' => $groupeGse3aId,
                'module_id' => $session[3],
                'prof_id' => $session[4],
                'salle_id' => $session[5],
                'jour' => $session[0],
                'heure_debut' => $session[1],
                'heure_fin' => $session[2],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Absences
        $firstStudentGinfo3a = $ginfo3aStudents->first();
        $secondStudentGinfo3a = $ginfo3aStudents->skip(1)->first();

        DB::table('absences')->insert([
            [
                'student_id' => $firstStudentGinfo3a,
                'module_id' => $moduleWebId,
                'date_absence' => '2026-05-06',
                'seance_debut' => '08:30:00',
                'seance_fin' => '10:30:00',
                'est_justifie' => true,
                'statut_justification' => 'validated',
                'created_at' => now(),
            ],
            [
                'student_id' => $firstStudentGinfo3a,
                'module_id' => $moduleReseauxId,
                'date_absence' => '2026-05-03',
                'seance_debut' => '10:30:00',
                'seance_fin' => '12:30:00',
                'est_justifie' => false,
                'statut_justification' => 'pending',
                'created_at' => now(),
            ],
            [
                'student_id' => $secondStudentGinfo3a,
                'module_id' => $moduleIAId,
                'date_absence' => '2026-04-29',
                'seance_debut' => '14:00:00',
                'seance_fin' => '16:00:00',
                'est_justifie' => false,
                'statut_justification' => 'pending',
                'created_at' => now(),
            ],
        ]);

        // Seed Administrative Requests
        DB::table('demandes_administratives')->insert([
            [
                'user_id' => $firstStudentGinfo3a,
                'type' => 'Attestation de scolarité',
                'motif' => 'Pour inscription en master',
                'statut' => 'pending',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'user_id' => $secondStudentGinfo3a,
                'type' => 'Relevé de notes',
                'motif' => 'Demande de stage',
                'statut' => 'validated',
                'created_at' => now()->subDays(2),
                'updated_at' => now()->subDay(),
            ],
        ]);

        // Seed Classroom Documents
        DB::table('classroom_documents')->insert([
            [
                'module_id' => $moduleWebId,
                'prof_id' => $prof1->id,
                'titre' => 'Introduction à Laravel',
                'file_path' => '/documents/laravel-intro.pdf',
                'type' => 'Cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'module_id' => $moduleWebId,
                'prof_id' => $prof1->id,
                'titre' => 'TP - Création d\'une API REST',
                'file_path' => '/documents/tp-api-rest.pdf',
                'type' => 'TP',
                'created_at' => now()->subDays(3),
                'updated_at' => now()->subDays(3),
            ],
            [
                'module_id' => $moduleReseauxId,
                'prof_id' => $prof2->id,
                'titre' => 'Protocoles de Routage',
                'file_path' => '/documents/routage.pdf',
                'type' => 'Cours',
                'created_at' => now()->subDays(5),
                'updated_at' => now()->subDays(5),
            ],
            [
                'module_id' => $moduleIAId,
                'prof_id' => $prof3->id,
                'titre' => 'Machine Learning Basics',
                'file_path' => '/documents/ml-basics.pdf',
                'type' => 'Cours',
                'created_at' => now()->subWeek(),
                'updated_at' => now()->subWeek(),
            ],
        ]);

        // Seed Cahier de Textes
        DB::table('cahier_textes')->insert([
            [
                'prof_id' => $prof1->id,
                'module_id' => $moduleWebId,
                'groupe_id' => $groupeGinfo3aId,
                'date_seance' => '2026-05-06',
                'heure_debut' => '08:30:00',
                'heure_fin' => '10:30:00',
                'objectif' => 'Introduction à Laravel et architecture MVC. Routes, contrôleurs et vues.',
                'nature' => 'Cours',
                'created_at' => now(),
                'updated_at' => now(),
            ],
            [
                'prof_id' => $prof2->id,
                'module_id' => $moduleReseauxId,
                'groupe_id' => $groupeGinfo3bId,
                'date_seance' => '2026-05-07',
                'heure_debut' => '08:30:00',
                'heure_fin' => '10:30:00',
                'objectif' => 'Configuration routeurs Cisco. Protocoles OSPF et EIGRP.',
                'nature' => 'TP',
                'created_at' => now(),
                'updated_at' => now(),
            ],
        ]);
    }
}
