<?php

return [

    'paths' => [
        'api/*',
        'storage/*',
        'sanctum/csrf-cookie',
        'login',
        'register',
        'logout',
        'me',
    ],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        // Keep local dev origins
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://localhost:3000',

        // Production frontend – exact match (most important)
        'https://spirited-courtesy-production.up.railway.app',

        // Backend domain itself (sometimes needed for same-origin testing or redirects)
        'https://onlineshop-production-2b86.up.railway.app',

        // If you ever preview branches or have temporary domains, add them here temporarily
        // 'https://spirited-courtesy-staging-abc123.up.railway.app',
    ],

    'allowed_origins_patterns' => [],   // ← leave empty unless using regex below

    'allowed_headers' => ['*'],

    'exposed_headers' => [
        'Authorization',
        'Content-Disposition',
    ],

    'max_age' => 86400,                 // 24 hours – good performance

    'supports_credentials' => false,    // correct – you're using Bearer tokens
];