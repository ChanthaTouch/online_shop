#!/usr/bin/env php
<?php

/**
 * Test script to verify image URLs are being generated correctly
 */

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "🧪 Testing Image URL Generation\n";
echo "================================\n\n";

// Test Product Images
echo "📦 Testing Product Images:\n";
$product = App\Models\Product::first();

if ($product) {
    echo "Product: {$product->name}\n";
    echo "Raw images field: " . json_encode($product->images) . "\n";
    echo "Primary Image: {$product->primary_image}\n";
    echo "Image URLs: " . json_encode($product->image_urls) . "\n\n";
    
    // Check if file exists
    if ($product->images && isset($product->images[0])) {
        $filePath = storage_path('app/public/' . $product->images[0]);
        echo "File exists: " . (file_exists($filePath) ? "✅ YES" : "❌ NO") . "\n";
        echo "File path: {$filePath}\n\n";
    }
} else {
    echo "❌ No products found in database\n\n";
}

// Test Category Images
echo "📁 Testing Category Images:\n";
$category = App\Models\Category::whereNotNull('image')->first();

if ($category) {
    echo "Category: {$category->name}\n";
    echo "Raw image field: {$category->image}\n";
    echo "Image URL: {$category->image_url}\n\n";
    
    // Check if file exists
    if ($category->image) {
        $filePath = storage_path('app/public/' . $category->image);
        echo "File exists: " . (file_exists($filePath) ? "✅ YES" : "❌ NO") . "\n";
        echo "File path: {$filePath}\n\n";
    }
} else {
    echo "❌ No categories with images found\n\n";
}

// Test Storage Link
echo "🔗 Testing Storage Link:\n";
$publicStorage = public_path('storage');
$storagePublic = storage_path('app/public');

if (is_link($publicStorage)) {
    echo "✅ Storage link exists\n";
    echo "Link: {$publicStorage}\n";
    echo "Target: " . readlink($publicStorage) . "\n";
    echo "Expected: {$storagePublic}\n\n";
} else if (is_dir($publicStorage)) {
    echo "⚠️  Storage directory exists but is not a symlink\n";
    echo "Path: {$publicStorage}\n\n";
} else {
    echo "❌ Storage link does NOT exist\n";
    echo "Run: php artisan storage:link\n\n";
}

// Test APP_URL
echo "🌐 Testing APP_URL:\n";
echo "APP_URL: " . env('APP_URL') . "\n";
echo "Generated URL: " . url('storage/test.jpg') . "\n\n";

echo "✅ Test complete!\n";
