<?php

return [

    'paths' => ['api/*', 'sanctum/csrf-cookie', 'login', 'register'],

    'allowed_methods' => ['*'],

    'allowed_origins' => ['*'], 

    'allowed_origins_patterns' => [
        '#^https://[a-z0-9-]+\.up\.railway\.app$#',
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => ['Authorization'],

    'max_age' => 0,

    'supports_credentials' => true,
];
