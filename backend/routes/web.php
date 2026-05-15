<?php

use Illuminate\Support\Facades\Route;

// No web routes - API only application
// All routes are in routes/api.php

Route::get('/', function () {
    return response()->json([
        'message' => 'UPF University Management System API',
        'version' => '1.0',
        'documentation' => '/api-docs.html',
        'endpoints' => [
            'authentication' => '/api/login',
            'admin' => '/api/admin/*',
            'professor' => '/api/professor/*',
            'student' => '/api/student/*'
        ]
    ]);
});
