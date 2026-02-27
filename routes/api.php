<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Gate;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\CategoryController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\DiscountController;
use App\Http\Controllers\PointsController;
use App\Http\Controllers\Admin\OrderAdminController;
use App\Http\Controllers\SmsController;
use App\Http\Controllers\MoceanController;

// ────────────────────────────────────────────────
// Public Authentication Routes
// ────────────────────────────────────────────────
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// ────────────────────────────────────────────────
// Public Catalog Routes (storefront)
// ────────────────────────────────────────────────
Route::get('/categories', [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
Route::get('/products', [ProductController::class, 'index']);
Route::get('/products/{slug}', [ProductController::class, 'show']);

// ────────────────────────────────────────────────
// Public Discount Application
// ────────────────────────────────────────────────
Route::post('/discounts/apply', [DiscountController::class, 'apply'])
    ->name('discounts.apply');

// ────────────────────────────────────────────────
// Mocean DLR Callback (Public)
// ────────────────────────────────────────────────
Route::put('/mocean/dlr', [MoceanController::class, 'dlr']);

// ────────────────────────────────────────────────
// Authenticated User Routes
// ────────────────────────────────────────────────
Route::middleware('auth:sanctum')->group(function () {

    // User session management
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Debug/test route for admin gate
    Route::get('/test-admin-gate', function () {
        if (Gate::allows('manage-catalog')) {
            return response()->json([
                'allowed' => true,
                'user_id' => auth()->id(),
                'role'    => auth()->user()?->role ?? 'no-role',
                'message' => 'You are allowed to manage catalog (admin)',
            ]);
        }

        return response()->json([
            'allowed' => false,
            'user_id' => auth()->id(),
            'role'    => auth()->user()?->role ?? 'no-role',
            'message' => 'Access denied - you do not have admin privileges',
        ], 403);
    });

    // ────────────────────────────────────────────────
    // Admin-only Catalog Management
    // ────────────────────────────────────────────────
    Route::middleware('can:manage-catalog')->group(function () {
        Route::post('/categories', [CategoryController::class, 'store']);
        Route::put('/categories/{id}', [CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);

        Route::post('/products', [ProductController::class, 'store']);
        Route::put('/products/{id}', [ProductController::class, 'update']);
        Route::delete('/products/{id}', [ProductController::class, 'destroy']);

        Route::apiResource('discounts', DiscountController::class)->only([
            'index', 'show', 'store', 'update', 'destroy'
        ]);
    });

    // ────────────────────────────────────────────────
    // Admin-only Order Management
    // ────────────────────────────────────────────────
    Route::middleware('can:manage-orders')->prefix('admin')->group(function () {
        Route::get('/orders', [OrderAdminController::class, 'index']);
        Route::get('/orders/{id}', [OrderAdminController::class, 'show']);
        Route::post('/orders/{id}/status', [OrderAdminController::class, 'updateStatus']);
        Route::post('/orders/{id}/cancel', [OrderAdminController::class, 'cancel']);
    });

    // ────────────────────────────────────────────────
    // Cart Routes
    // ────────────────────────────────────────────────
    Route::get('/cart', [CartController::class, 'index']);
    Route::post('/cart/items', [CartController::class, 'addItem']);
    Route::put('/cart/items/{id}', [CartController::class, 'updateItem']);
    Route::delete('/cart/items/{id}', [CartController::class, 'removeItem']);
    Route::post('/cart/clear', [CartController::class, 'clear']);

    // ────────────────────────────────────────────────
    // Order Routes
    // ────────────────────────────────────────────────
    Route::post('/orders/checkout', [OrderController::class, 'checkout']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{id}/cancel', [OrderController::class, 'cancel']);

    // ────────────────────────────────────────────────
    // Points Routes
    // ────────────────────────────────────────────────
    Route::get('/points', [PointsController::class, 'getBalance']);
    Route::get('/points/history', [PointsController::class, 'getHistory']);
    Route::get('/points/stats', [PointsController::class, 'getStats']);
    Route::post('/points/redeem', [PointsController::class, 'redeem']);

    // ────────────────────────────────────────────────
    // SMS Testing Routes (Admin Only)
    // ────────────────────────────────────────────────
    Route::middleware('can:manage-orders')->group(function () {
        Route::post('/sms/send', [SmsController::class, 'send']);
        Route::get('/sms/test', [SmsController::class, 'test']);
    });
});
