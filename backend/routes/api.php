<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\DashboardController;
use App\Http\Controllers\Api\GrantApplicationController;
use App\Http\Controllers\Api\GrantController;
use App\Http\Controllers\Api\LandController;
use App\Http\Controllers\Api\LawCaseController;
use App\Http\Controllers\Api\PermitController;
use App\Http\Controllers\Api\RegistrationController;
use App\Http\Controllers\Api\TaxController;
use Illuminate\Support\Facades\Route;

Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/register', [AuthController::class, 'register']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', [AuthController::class, 'logout']);
    Route::get('/auth/user', [AuthController::class, 'user']);

    Route::get('/dashboard/stats', [DashboardController::class, 'stats']);

    Route::apiResource('taxes', TaxController::class);
    Route::post('taxes/{tax}/pay', [TaxController::class, 'pay']);

    Route::apiResource('permits', PermitController::class);
    Route::post('permits/{permit}/approve', [PermitController::class, 'approve']);
    Route::post('permits/{permit}/reject', [PermitController::class, 'reject']);

    Route::apiResource('lands', LandController::class);
    Route::post('lands/{land}/transfer', [LandController::class, 'transfer']);

    Route::apiResource('grants', GrantController::class);
    Route::apiResource('grant-applications', GrantApplicationController::class);
    Route::post('grant-applications/{grantApplication}/approve', [GrantApplicationController::class, 'approve']);
    Route::post('grant-applications/{grantApplication}/reject', [GrantApplicationController::class, 'reject']);
    Route::post('grant-applications/{grantApplication}/disburse', [GrantApplicationController::class, 'disburse']);

    Route::apiResource('cases', LawCaseController::class);
    Route::post('cases/{case}/hearings', [LawCaseController::class, 'addHearing']);
    Route::get('cases/{case}/hearings', [LawCaseController::class, 'hearings']);

    Route::apiResource('registrations', RegistrationController::class);
    Route::post('registrations/{registration}/verify', [RegistrationController::class, 'verify']);
    Route::post('registrations/{registration}/approve', [RegistrationController::class, 'approve']);
});
