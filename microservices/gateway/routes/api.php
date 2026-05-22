<?php

use App\Http\Controllers\GatewayController;
use Illuminate\Support\Facades\Route;

Route::get('/dashboard/stats', [GatewayController::class, 'dashboard']);
Route::get('/health', [GatewayController::class, 'health']);
Route::any('/{service}/{path?}', [GatewayController::class, 'handle'])->where('path', '.*');
