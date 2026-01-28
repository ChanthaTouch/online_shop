<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth;


Route::prefix('auth')->group(function(){
    Route::post('/register', [AuthAuthController::class,'register']);
    Route::post('/login', [AuthAuthController::class,'login']);

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', [AuthAuthController::class,'logout']);
        Route::get('/me', [AuthAuthController::class,'me']);
    });
});