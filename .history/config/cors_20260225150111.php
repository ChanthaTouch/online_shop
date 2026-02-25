<?php

return [
    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'register',
        'logout',
        'me',           // if you have /api/me
        'user',         // adjust if needed
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Keep local dev
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',     // sometimes Vite uses 3000

        // Old combined domain (if still testing there)
        'https://onlineshop-production-2b886.up.railway.app',

        // New separate frontend domain (exact match – no trailing slash!)
        'https://spirited-courtesy-production.up.railway.app',

        // Wildcard for Railway preview/temp domains (very useful during dev)
        'https://*.up.railway.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization',
        'X-Requested-With',
    ],

    'max_age' => 86400,  // Cache preflight for 24 hours → faster subsequent requests

    // Important: set to false if using Bearer token (JWT/Sanctum token in header)
    // Set to true only if using cookies + Sanctum stateful auth
    'supports_credentials' => false,
];