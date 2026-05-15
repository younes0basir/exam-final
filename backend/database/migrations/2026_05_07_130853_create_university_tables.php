<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // 1. Filieres
        Schema::create('filieres', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->string('code', 50)->unique()->nullable();
            $table->text('description')->nullable();
            $table->timestamps();
        });

        // 2. Groupes
        Schema::create('groupes', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->timestamps();
        });

        // 3. Modules
        Schema::create('modules', function (Blueprint $table) {
            $table->id();
            $table->string('nom');
            $table->foreignId('filiere_id')->constrained('filieres')->onDelete('cascade');
            $table->timestamps();
        });

        // 4. Module Professor (Pivot)
        Schema::create('module_professor', function (Blueprint $table) {
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('professor_id')->constrained('users')->onDelete('cascade');
            $table->primary(['module_id', 'professor_id']);
        });

        // 5. Student Group (Registration)
        Schema::create('student_group', function (Blueprint $table) {
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('group_id')->constrained('groupes')->onDelete('cascade');
            $table->primary(['student_id', 'group_id']);
        });

        // 6. Salles
        Schema::create('salles', function (Blueprint $table) {
            $table->id();
            $table->string('nom', 50)->unique();
            $table->integer('capacite')->default(30);
            $table->timestamps();
        });

        // 7. Notes
        Schema::create('notes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->decimal('cc1', 5, 2)->nullable();
            $table->decimal('cc2', 5, 2)->nullable();
            $table->decimal('examen', 5, 2)->nullable();
            $table->decimal('note_finale', 5, 2)->nullable();
            $table->timestamps();
        });

        // 8. Absences
        Schema::create('absences', function (Blueprint $table) {
            $table->id();
            $table->foreignId('student_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->date('date_absence');
            $table->time('seance_debut');
            $table->time('seance_fin');
            $table->boolean('est_justifie')->default(false);
            $table->string('justification_file')->nullable();
            $table->enum('statut_justification', ['pending', 'validated', 'rejected'])->default('pending');
            $table->text('motif_rejet')->nullable();
            $table->timestamps();
        });

        // 9. Cahier de Textes
        Schema::create('cahier_textes', function (Blueprint $table) {
            $table->id();
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->date('date_seance');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->text('objectif')->nullable();
            $table->enum('nature', ['Cours', 'TD', 'TP']);
            $table->timestamps();
        });

        // 10. Emplois du Temps
        Schema::create('emplois_du_temps', function (Blueprint $table) {
            $table->id();
            $table->foreignId('groupe_id')->constrained('groupes')->onDelete('cascade');
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->enum('jour', ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']);
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->timestamps();
        });

        // 11. Reservations Salles
        Schema::create('reservations_salles', function (Blueprint $table) {
            $table->id();
            $table->foreignId('salle_id')->constrained('salles')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->date('date_reservation');
            $table->time('heure_debut');
            $table->time('heure_fin');
            $table->text('motif')->nullable();
            $table->enum('statut', ['pending', 'validated', 'rejected'])->default('pending');
            $table->timestamps();
        });

        // 12. Demandes Administratives
        Schema::create('demandes_administratives', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->string('type');
            $table->text('motif')->nullable();
            $table->enum('statut', ['pending', 'validated', 'rejected'])->default('pending');
            $table->text('motif_rejet')->nullable();
            $table->string('document_path')->nullable();
            $table->timestamps();
        });

        // 13. Classroom Annonces
        Schema::create('classroom_annonces', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->string('titre');
            $table->text('contenu');
            $table->timestamps();
        });

        // 14. Classroom Documents
        Schema::create('classroom_documents', function (Blueprint $table) {
            $table->id();
            $table->foreignId('module_id')->constrained('modules')->onDelete('cascade');
            $table->foreignId('prof_id')->constrained('users')->onDelete('cascade');
            $table->string('titre');
            $table->string('file_path');
            $table->enum('type', ['Cours', 'TD', 'TP', 'Autre'])->default('Cours');
            $table->timestamps();
        });

        // 15. Classroom Commentaires
        Schema::create('classroom_commentaires', function (Blueprint $table) {
            $table->id();
            $table->foreignId('annonce_id')->constrained('classroom_annonces')->onDelete('cascade');
            $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
            $table->text('contenu');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('classroom_commentaires');
        Schema::dropIfExists('classroom_documents');
        Schema::dropIfExists('classroom_annonces');
        Schema::dropIfExists('demandes_administratives');
        Schema::dropIfExists('reservations_salles');
        Schema::dropIfExists('emplois_du_temps');
        Schema::dropIfExists('cahier_textes');
        Schema::dropIfExists('absences');
        Schema::dropIfExists('notes');
        Schema::dropIfExists('salles');
        Schema::dropIfExists('student_group');
        Schema::dropIfExists('module_professor');
        Schema::dropIfExists('modules');
        Schema::dropIfExists('groupes');
        Schema::dropIfExists('filieres');
    }
};
