<?php

use App\Http\Controllers\LawCaseController;
use Illuminate\Support\Facades\Route;

Route::get('/cases/stats', [LawCaseController::class, 'stats']);
Route::get('/cases', [LawCaseController::class, 'index']);
Route::post('/cases', [LawCaseController::class, 'store']);
Route::get('/cases/{case}', [LawCaseController::class, 'show']);
Route::put('/cases/{case}', [LawCaseController::class, 'update']);
Route::get('/cases/{case}/hearings', [LawCaseController::class, 'hearings']);
Route::post('/cases/{case}/hearings', [LawCaseController::class, 'addHearing']);
