<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class CorsMiddleware
{
    public function handle(Request $request, Closure $next)
    {
        // Debug: Log all incoming requests
        Log::info('Request method: ' . $request->method() . ', Path: ' . $request->path() . ', Origin: ' . $request->header('Origin'));

        // Handle preflight OPTIONS requests
        if ($request->getMethod() === 'OPTIONS') {
            $response = response('', 204);
            $this->addCorsHeaders($response, $request);
            return $response;
        }

        // For non-OPTIONS requests, pass to next middleware
        $response = $next($request);
        $this->addCorsHeaders($response, $request);

        return $response;
    }

    protected function addCorsHeaders($response, $request)
    {
        $origin = $request->header('Origin');

        // Debug: Log origin
        Log::info('Adding CORS headers for origin: ' . $origin);

        // Allowed origins from config
        $allowedOrigins = config('cors.allowed_origins');

        if (in_array('*', $allowedOrigins) || in_array($origin, $allowedOrigins)) {
            $response->header('Access-Control-Allow-Origin', $origin ?? '*');
            $response->header('Access-Control-Allow-Methods', implode(', ', config('cors.allowed_methods')));
            $response->header('Access-Control-Allow-Headers', implode(', ', config('cors.allowed_headers')));
            $response->header('Access-Control-Expose-Headers', implode(', ', config('cors.exposed_headers')));
            $response->header('Access-Control-Max-Age', config('cors.max_age'));
            $response->header('Access-Control-Allow-Credentials', config('cors.supports_credentials') ? 'true' : 'false');
            $response->header('Vary', 'Origin');
        }
    }
}