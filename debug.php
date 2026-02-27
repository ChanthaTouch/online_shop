<?php
// Quick debug script to check Railway environment
echo "=== Laravel Debug Info ===\n\n";

// Check if .env.production exists
echo "1. Environment file check:\n";
echo file_exists('.env.production') ? "✓ .env.production exists\n" : "✗ .env.production missing\n";
echo file_exists('.env') ? "✓ .env exists\n" : "✗ .env missing\n";

// Check PHP version
echo "\n2. PHP Version: " . PHP_VERSION . "\n";

// Check required extensions
echo "\n3. Required Extensions:\n";
$required = ['pdo', 'pdo_mysql', 'mbstring', 'openssl', 'tokenizer', 'xml', 'ctype', 'json'];
foreach ($required as $ext) {
    echo extension_loaded($ext) ? "✓ $ext\n" : "✗ $ext MISSING\n";
}

// Check database connection
echo "\n4. Database Connection:\n";
try {
    require __DIR__.'/vendor/autoload.php';
    $app = require_once __DIR__.'/bootstrap/app.php';
    $app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();
    
    $host = env('DB_HOST', 'not set');
    $database = env('DB_DATABASE', 'not set');
    $username = env('DB_USERNAME', 'not set');
    
    echo "Host: $host\n";
    echo "Database: $database\n";
    echo "Username: $username\n";
    
    DB::connection()->getPdo();
    echo "✓ Database connection successful\n";
} catch (Exception $e) {
    echo "✗ Database connection failed: " . $e->getMessage() . "\n";
}

// Check storage permissions
echo "\n5. Storage Permissions:\n";
$dirs = ['storage/framework/sessions', 'storage/framework/cache', 'storage/logs'];
foreach ($dirs as $dir) {
    if (is_dir($dir) && is_writable($dir)) {
        echo "✓ $dir is writable\n";
    } else {
        echo "✗ $dir is not writable or doesn't exist\n";
    }
}

echo "\n=== End Debug Info ===\n";
