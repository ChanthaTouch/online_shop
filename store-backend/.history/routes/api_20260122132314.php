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
    Route::middleware('can:manage-catalog')->group(function(){
       Route::post('categories',[CategoryController::class,'store']);
       Route::put('categories/{id}',[CategoryController::class,'update']);
       Route::delete('categories/{id}',[CategoryController::class,'destroy']);

       Route::post('products',[ProductController::class,'store']);
       Route::put('products/{id}',[ProductController::class,'update']);
       Route::delete('products/{id}',[ProductController::class,'destroy']);
    });
    Route::get('cart',[CategoryController::class,'index']);
    Route::post('cart/items',[CategoryController::class,'addItem']);
    Route::put('cart/items/{id}',[CategoryController::class,'updateItem']);
    Route::delete('cart/items/{id}',[CategoryController::class,'removeItem']);

    Route::post('checkout',[CategoryController::class,'createOrder']);
    Route::get('orders',[CategoryController::class,'index']);
    Route::get('orders/{id}',[CategoryController::class,'show']);
    
});
Route::post('payments/we')