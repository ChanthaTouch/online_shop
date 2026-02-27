#!/bin/bash

echo "=== Laravel Railway Deployment ==="

# Run environment check
php check-env.php

# Create directories
echo "Creating directories..."
mkdir -p storage/framework/{sessions,views,cache}
mkdir -p storage/logs
mkdir -p bootstrap/cache

# Set permissions
echo "Setting permissions..."
chmod -R 777 storage bootstrap/cache 2>&1 || true

# Link storage
echo "Linking storage..."
mkdir -p storage/app/public/products
php artisan storage:link --force 2>&1 || {
    echo "Storage link command failed, creating manually..."
    rm -rf public/storage
    ln -s ../storage/app/public public/storage
}

# Verify storage link
if [ -L "public/storage" ] || [ -d "public/storage" ]; then
    echo "✓ Storage link exists"
else
    echo "✗ WARNING: Storage link missing!"
fi

# Test database connection
echo "Testing database connection..."
php artisan db:show 2>&1 || echo "Database check failed - continuing anyway"

# Run migrations
echo "Running migrations..."
php artisan migrate --force 2>&1 || {
    echo "ERROR: Migrations failed!"
    echo "Attempting to continue..."
}

# Clear and cache
echo "Clearing caches..."
php artisan config:clear 2>&1
php artisan cache:clear 2>&1

echo "Caching config..."
php artisan config:cache 2>&1

echo "Caching routes..."
php artisan route:cache 2>&1

echo "Caching views..."
php artisan view:cache 2>&1

# Start server
echo "=== Starting server on port ${PORT:-8000} ==="
php artisan serve --host=0.0.0.0 --port=${PORT:-8000} --no-reload
