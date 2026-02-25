<?php

use Illuminate\Foundation\Application;
use Illuminate\Foundation\Configuration\Exceptions;
use Illuminate\Foundation\Configuration\Middleware;
use Illuminate\Support\Facades\Log;

return Application::configure(basePath: dirname(__DIR__))
    ->withRouting(
        web: __DIR__.'/../routes/web.php',
        api: __DIR__.'/../routes/api.php',
        commands: __DIR__.'/../routes/console.php',
        health: '/up',
    )
    ->withMiddleware(function (Middleware $middleware) {
        // Add CORS globally – this must run for OPTIONS requests
        $middleware->append(\Illuminate\Http\Middleware\HandleCors::class);
        
        // Debug log to confirm this code is executed on startup
        Log::info('CORS middleware appended globally in bootstrap/app.php');
    })
    ->withExceptions(function (Exceptions $exceptions) {
        //
    })->create();