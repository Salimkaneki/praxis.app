<?php

use App\Http\Controllers\Student\StudentProfileController;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Student API Routes
|--------------------------------------------------------------------------
|
| Routes for student profile management
|
*/

// Routes protégées (nécessitent authentification)
Route::middleware('auth:sanctum')->group(function () {

    // Profile routes
    Route::prefix('student')->group(function () {
        Route::get('/profile', [StudentProfileController::class, 'show']);
        Route::put('/profile', [StudentProfileController::class, 'update']);
        Route::post('/change-password', [StudentProfileController::class, 'changePassword']);
        Route::post('/profile-picture', [StudentProfileController::class, 'uploadProfilePicture']);
        Route::delete('/profile-picture', [StudentProfileController::class, 'deleteProfilePicture']);
    });

});