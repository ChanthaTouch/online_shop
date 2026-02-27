#!/usr/bin/env php
<?php

echo "=== Environment Check ===\n\n";

// Check critical env vars
$required = [
    'APP_KEY',
    'DB_HOST',
    'DB_PORT', 
    'DB_DATABASE',
    'DB_USERNAME',
    'DB_PASSWORD',
    'PORT'
];

echo "Environment Variables:\n";
foreach ($required as $var) {
    $value = getenv($var);
    if ($value === false) {
        echo "❌ $var: NOT SET\n";
    } else {
        $display = in_array($var, ['DB_PASSWORD', 'APP_KEY']) 
            ? substr($value, 0, 10) . '...' 
            : $value;
        echo "✓ $var: $display\n";
    }
}

echo "\nPHP Version: " . PHP_VERSION . "\n";
echo "PHP Extensions:\n";
$exts = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml'];
foreach ($exts as $ext) {
    echo (extension_loaded($ext) ? "✓" : "❌") . " $ext\n";
}

echo "\n=== End Check ===\n";
