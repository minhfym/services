<?php

use App\Http\Controllers\GrantController;
use App\Http\Controllers\GrantApplicationController;
use Illuminate\Support\Facades\Route;

Route::get('/grants/stats', [GrantController::class, 'stats']);
Route::get('/grants', [GrantController::class, 'index']);
Route::post('/grants', [GrantController::class, 'store']);
Route::get('/grants/{grant}', [GrantController::class, 'show']);
Route::put('/grants/{grant}', [GrantController::class, 'update']);

Route::get('/grant-applications', [GrantApplicationController::class, 'index']);
Route::post('/grant-applications', [GrantApplicationController::class, 'store']);
Route::get('/grant-applications/{app}', [GrantApplicationController::class, 'show']);
Route::put('/grant-applications/{app}', [GrantApplicationController::class, 'update']);
Route::post('/grant-applications/{app}/approve', [GrantApplicationController::class, 'approve']);
Route::post('/grant-applications/{app}/reject', [GrantApplicationController::class, 'reject']);
Route::post('/grant-applications/{app}/disburse', [GrantApplicationController::class, 'disburse']);
