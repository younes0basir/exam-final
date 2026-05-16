<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\ProfessorController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\ReservationController;
use App\Http\Controllers\Api\ClassroomController;
use App\Http\Controllers\Api\AbsenceController;
use App\Http\Controllers\Api\DocumentController;
use App\Http\Controllers\Api\LanguageController;

// Public API routes
Route::post('/login', [AuthController::class, 'login']);

// Language routes (public)
Route::get('/languages', [LanguageController::class, 'getLanguages']);
Route::get('/translations/{locale?}', [LanguageController::class, 'getTranslations']);

// Protected API routes
Route::middleware('auth:sanctum')->group(function () {

    // Auth
    Route::get('/user', [AuthController::class, 'user']);
    Route::post('/logout', [AuthController::class, 'logout']);
    
    // Language switching (authenticated)
    Route::post('/language', [LanguageController::class, 'setLanguage']);

    // Admin Routes
    Route::middleware(['api.role:admin'])->prefix('admin')->group(function () {
        Route::get('/dashboard/stats', [AdminController::class, 'stats']);
        Route::get('/dashboard/analytics', [AdminController::class, 'analytics']);
        Route::get('/users', [AdminController::class, 'users']);
        Route::post('/users/student', [AdminController::class, 'storeStudent']);
        Route::get('/academic/filieres', [AdminController::class, 'filieres']);
        Route::get('/academic/groupes', [AdminController::class, 'groupes']);
        Route::get('/academic/modules', [AdminController::class, 'modules']);
        Route::get('/timetable', [AdminController::class, 'timetable']);
        Route::get('/requests', [AdminController::class, 'requests']);
        Route::patch('/requests/{id}', [AdminController::class, 'updateRequestStatus']);

        // Admin: Gestion des réservations de salles
        Route::get('/reservations', [ReservationController::class, 'allReservations']);
        Route::patch('/reservations/{id}/status', [ReservationController::class, 'updateStatus']);
        Route::put('/reservations/{id}', [ReservationController::class, 'update']);
        Route::delete('/reservations/{id}', [ReservationController::class, 'adminDestroy']);

        // Admin: Gestion des absences
        Route::get('/absences', [AbsenceController::class, 'allAbsences']);
        Route::patch('/absences/{id}/validate', [AbsenceController::class, 'validateAbsence']);

        // Admin: Gestion du classroom (annonces)
        Route::get('/classroom/annonces', [ClassroomController::class, 'allAnnonces']);
        Route::delete('/classroom/annonces/{id}', [ClassroomController::class, 'adminDeleteAnnonce']);
        Route::delete('/classroom/commentaires/{id}', [ClassroomController::class, 'adminDeleteCommentaire']);

        // Admin: Génération PDF documents
        Route::get('/documents/{demandeId}/download', [DocumentController::class, 'generateDocument']);
        Route::get('/documents/{demandeId}/preview', [DocumentController::class, 'previewDocument']);
    });

    // Professor Routes
    Route::middleware(['api.role:professor'])->prefix('professor')->group(function () {
        Route::get('/dashboard/stats', [ProfessorController::class, 'stats']);
        Route::get('/modules', [ProfessorController::class, 'modules']);
        Route::get('/grades/{moduleId}', [ProfessorController::class, 'getGrades']);
        Route::post('/grades/{moduleId}', [ProfessorController::class, 'storeGrades']);
        Route::get('/session-log', [ProfessorController::class, 'sessionLog']);

        // Professor: Demandes administratives
        Route::get('/requests', [StudentController::class, 'requests']);
        Route::post('/requests', [StudentController::class, 'storeRequest']);

        // Professor: Téléchargement documents
        Route::get('/documents/{demandeId}/download', [DocumentController::class, 'generateDocument']);

        // Professor: Réservation de salles
        Route::get('/reservations', [ReservationController::class, 'index']);
        Route::get('/salles/disponibilites', [ReservationController::class, 'disponibilites']);
        Route::get('/salles', [ReservationController::class, 'salles']);
        Route::post('/reservations', [ReservationController::class, 'store']);
        Route::delete('/reservations/{id}', [ReservationController::class, 'destroy']);

        // Professor: Gestion des absences
        Route::get('/absences', [AbsenceController::class, 'professorAbsences']);
        Route::post('/absences', [AbsenceController::class, 'storeAbsence']);
        Route::delete('/absences/{id}', [AbsenceController::class, 'destroyAbsence']);

        // Professor: Classroom
        Route::get('/classroom/modules', [ClassroomController::class, 'professorModules']);
        Route::get('/classroom/annonces', [ClassroomController::class, 'professorAnnonces']);
        Route::post('/classroom/annonces', [ClassroomController::class, 'storeAnnonce']);
        Route::delete('/classroom/annonces/{id}', [ClassroomController::class, 'deleteAnnonce']);
        Route::post('/classroom/documents', [ClassroomController::class, 'storeDocument']);
        Route::delete('/classroom/documents/{id}', [ClassroomController::class, 'deleteDocument']);
    });

    // Student Routes
    Route::middleware(['api.role:student'])->prefix('student')->group(function () {
        Route::get('/dashboard/stats', [StudentController::class, 'stats']);
        Route::get('/results', [StudentController::class, 'results']);
        Route::get('/timetable', [StudentController::class, 'timetable']);
        Route::get('/materials', [StudentController::class, 'materials']);
        Route::get('/absences', [StudentController::class, 'absences']);
        Route::post('/absences/{id}/justificatif', [AbsenceController::class, 'uploadJustificatif']);
        Route::get('/requests', [StudentController::class, 'requests']);
        Route::post('/requests', [StudentController::class, 'storeRequest']);

        // Student: Classroom
        Route::get('/classroom/annonces', [ClassroomController::class, 'studentAnnonces']);
        Route::get('/classroom/annonces/{id}/commentaires', [ClassroomController::class, 'getCommentaires']);
        Route::post('/classroom/annonces/{id}/commentaires', [ClassroomController::class, 'storeCommentaire']);

        // Student: Téléchargement documents
        Route::get('/documents/{demandeId}/download', [DocumentController::class, 'generateDocument']);
    });
});
