#!/usr/bin/env php
<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Image Storage Check ===\n\n";

// Check storage directory
$storagePath = storage_path('app/public/products');
echo "Storage path: $storagePath\n";
echo "Exists: " . (is_dir($storagePath) ? "✓ Yes" : "✗ No") . "\n";

if (is_dir($storagePath)) {
    $files = glob($storagePath . '/*');
    echo "Files in storage: " . count($files) . "\n\n";
    
    if (count($files) > 0) {
        echo "Sample files:\n";
        foreach (array_slice($files, 0, 5) as $file) {
            $size = filesize($file);
            echo "  - " . basename($file) . " (" . round($size/1024, 2) . " KB)\n";
        }
    }
} else {
    echo "\n⚠️  Storage directory doesn't exist!\n";
}

// Check products in database
echo "\n=== Products in Database ===\n";
$products = App\Models\Product::select('id', 'name', 'images')->take(5)->get();

foreach ($products as $product) {
    echo "\nProduct: {$product->name} (ID: {$product->id})\n";
    if ($product->images) {
        foreach ($product->images as $imagePath) {
            $fullPath = storage_path('app/public/' . $imagePath);
            $exists = file_exists($fullPath);
            echo "  " . ($exists ? "✓" : "✗") . " $imagePath\n";
            if (!$exists) {
                echo "    Missing: $fullPath\n";
            }
        }
    } else {
        echo "  No images\n";
    }
}

echo "\n=== Summary ===\n";
echo "If images are missing, you need to:\n";
echo "1. Re-upload images on production, OR\n";
echo "2. Use Cloudinary for persistent storage\n";
echo "\nSee IMMEDIATE_FIX.md for details.\n";
