<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth;


Route::prefix('auth')->group(function(){
    Route::post('/register', [Auth::class,'register']);
    Route::post('/login', [Auth::class,'login']);

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', [Auth::class,'logout']);
        Route::get('/me', [Auth::class,'me']);
    });
});