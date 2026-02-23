<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;


Route::prefix('auth')->group(function(){
    Route::post('/register', [AuthController::class,'register']);
    Route::post('/login', [AuthController::class,'login']);

    Route::middleware('auth:sanctum')->group(function(){
        Route::post('/logout', [AuthController::class,'logout']);
        Route::get('/me', [AuthController::class,'me']);
    });
});
Route::get('categories',[CategoryController::class,'index']);
Route::get('products',[ProductController::class,'index']);
Route::get('products/{slug}',[ProductController::class,'show']);

Route::middleware('auth:sanctum')->group(function(){
    Route::middleware('a')
    
});