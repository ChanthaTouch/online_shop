<?php

return [

    'paths' => ['*'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Keep local dev origins
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',

        'https://spirited-courtesy-production.up.railway.app',
        'https://onlineshop-production-2b86.up.railway.app',
    ],

    'allowed_origins_patterns' => [],   // ← leave empty unless using regex below

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization',
        'Content-Disposition',
        'Content-Type',
        'Accept',
    ],

    'max_age' => 86400,                 // 24 hours – good performance

    'supports_credentials' => true,     // Enable credentials for cross-origin requests
];