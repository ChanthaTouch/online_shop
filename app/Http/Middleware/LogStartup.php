<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class LogStartup
{
    public function handle(Request $request, Closure $next)
    {
        Log::info('App booted successfully - CORS middleware is active');
        Log::info('Request: ' . $request->method() . ' ' . $request->fullUrl());
        Log::info('Origin: ' . ($request->header('Origin') ?? 'none'));

        return $next($request);
    }
}