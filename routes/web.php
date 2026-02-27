<?php

use Illuminate\Support\Facades\Route;

// Serve storage files with proper CORS headers
Route::get('/storage/{path}', function ($path) {
    $file = storage_path('app/public/' . $path);
    
    if (!file_exists($file)) {
        abort(404, 'File not found: ' . $path);
    }
    
    $mimeType = mime_content_type($file);
    
    return response()->file($file, [
        'Content-Type' => $mimeType,
        'Access-Control-Allow-Origin' => '*',
        'Access-Control-Allow-Methods' => 'GET, OPTIONS',
        'Access-Control-Allow-Headers' => '*',
        'Cache-Control' => 'public, max-age=31536000',
    ]);
})->where('path', '.*');

// Serve the SPA for all non-API routes
Route::get('/{any}', function () {
    return file_get_contents(public_path('index.html'));
})->where('any', '.*');
