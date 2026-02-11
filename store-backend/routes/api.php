<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DiscountController;   // ← Add this line
use App\Http\Controllers\Api\RestaurantController;
use App\Http\Controllers\Api\OrderController as ApiOrderController;
use App\Http\Controllers\Api\AuthController as ApiAuthController;

// Authentication Routes (public) — point to simple API Auth for delivery demo
Route::post('/register', [ApiAuthController::class, 'register']);
Route::post('/login', [ApiAuthController::class, 'login']);

// Restaurants and menus (public)
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}/menu', [RestaurantController::class, 'menu']);

// ────────────────────────────────────────────────
//     Delivery demo endpoints (restaurants, menu, orders)
// ────────────────────────────────────────────────
Route::get('/restaurants', [RestaurantController::class, 'index']);
Route::get('/restaurants/{id}/menu', [RestaurantController::class, 'menu']);

Route::get('/orders', [ApiOrderController::class, 'index']);
Route::post('/orders', [ApiOrderController::class, 'store']);
Route::get('/orders/{id}', [ApiOrderController::class, 'show']);

// Orders (authenticated)
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
});


