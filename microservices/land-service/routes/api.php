<?php

use App\Http\Controllers\LandController;
use Illuminate\Support\Facades\Route;

Route::get('/lands/stats', [LandController::class, 'stats']);
Route::get('/lands', [LandController::class, 'index']);
Route::post('/lands', [LandController::class, 'store']);
Route::get('/lands/{land}', [LandController::class, 'show']);
Route::put('/lands/{land}', [LandController::class, 'update']);
Route::post('/lands/{land}/transfer', [LandController::class, 'transfer']);
Route::post('/lands/{land}/transfers/{transfer}/complete', [LandController::class, 'completeTransfer']);
