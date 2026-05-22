<?php

use App\Http\Controllers\PermitController;
use Illuminate\Support\Facades\Route;

Route::get('/permits/stats', [PermitController::class, 'stats']);
Route::get('/permits', [PermitController::class, 'index']);
Route::post('/permits', [PermitController::class, 'store']);
Route::get('/permits/{permit}', [PermitController::class, 'show']);
Route::put('/permits/{permit}', [PermitController::class, 'update']);
Route::post('/permits/{permit}/approve', [PermitController::class, 'approve']);
Route::post('/permits/{permit}/reject', [PermitController::class, 'reject']);
