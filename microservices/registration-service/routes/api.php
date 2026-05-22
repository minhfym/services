<?php

use App\Http\Controllers\RegistrationController;
use Illuminate\Support\Facades\Route;

Route::get('/registrations/stats', [RegistrationController::class, 'stats']);
Route::get('/registrations', [RegistrationController::class, 'index']);
Route::post('/registrations', [RegistrationController::class, 'store']);
Route::get('/registrations/{registration}', [RegistrationController::class, 'show']);
Route::put('/registrations/{registration}', [RegistrationController::class, 'update']);
Route::post('/registrations/{registration}/verify', [RegistrationController::class, 'verify']);
Route::post('/registrations/{registration}/approve', [RegistrationController::class, 'approve']);
Route::post('/registrations/{registration}/reject', [RegistrationController::class, 'reject']);
