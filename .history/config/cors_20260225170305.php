<?php

return [

    'paths' => [
        'api/*',
        'sanctum/csrf-cookie',
        'login',
        'register',
        'logout',
        'me',               // if you use /api/me or similar
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Local development (Vite dev server)
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',

        // Old combined deployment (keep for testing if needed)
        'https://onlineshop-production-2b886.up.railway.app',

        // New separate frontend domain – exact match
        'https://spirited-courtesy-production.up.railway.app',

        // Wildcard for all Railway preview / temporary domains
        // This is very useful during development and when domains change
        'https://*.up.railway.app',
    ],

    'allowed_origins_patterns' => [],

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization',
        'Content-Disposition',
    ],

    // Cache preflight response for 24 hours → much faster subsequent requests
    'max_age' => 86400,

    // Set to false because you're using Bearer token authentication
    // (not cookie-based / withCredentials)
    'supports_credentials' => false,
];