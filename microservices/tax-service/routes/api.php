<?php

use App\Http\Controllers\TaxController;
use Illuminate\Support\Facades\Route;

Route::get('/taxes/stats', [TaxController::class, 'stats']);
Route::get('/taxes', [TaxController::class, 'index']);
Route::post('/taxes', [TaxController::class, 'store']);
Route::get('/taxes/{tax}', [TaxController::class, 'show']);
Route::put('/taxes/{tax}', [TaxController::class, 'update']);
Route::post('/taxes/{tax}/pay', [TaxController::class, 'pay']);
