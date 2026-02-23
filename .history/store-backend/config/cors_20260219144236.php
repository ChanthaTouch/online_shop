<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Local development
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:8000',

        // Production frontend (Railway)
        'https://awake-comfort-production.up.railway.app',
    ],

    // Allow any Railway subdomain (fallback if frontend URL changes)
    'allowed_origins_patterns' => [
        '#^https://[a-z0-9-]+\.up\.railway\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,
];
