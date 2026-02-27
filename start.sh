#!/bin/bash
set -e

echo "=== Starting Laravel Application ==="
echo "Environment: $APP_ENV"
echo "Port: ${PORT:-8000}"

# Create necessary directories
echo "Creating storage directories..."
mkdir -p storage/framework/{sessions,views,cache,testing}
mkdir -p storage/logs
mkdir -p bootstrap/cache
mkdir -p public/storage

# Set permissions
echo "Setting permissions..."
chmod -R 775 storage bootstrap/cache 2>/dev/null || true

# Check database connection before proceeding
echo "Checking database connection..."
php artisan db:show 2>/dev/null || echo "Warning: Could not show database info"

# Run Laravel setup commands
echo "Running Laravel setup..."
php artisan storage:link 2>/dev/null || echo "Storage link already exists"

echo "Running migrations..."
php artisan migrate --force --no-interaction || {
    echo "ERROR: Migration failed!"
    exit 1
}

echo "Caching configuration..."
php artisan config:cache || {
    echo "ERROR: Config cache failed!"
    exit 1
}

echo "Caching routes..."
php artisan route:cache || {
    echo "ERROR: Route cache failed!"
    exit 1
}

echo "Caching views..."
php artisan view:cache || {
    echo "ERROR: View cache failed!"
    exit 1
}

echo "=== Laravel setup complete ==="

# Check if PORT is set
if [ -z "$PORT" ]; then
    export PORT=8000
fi

echo "Starting PHP built-in server on 0.0.0.0:$PORT..."
echo "Application URL: $APP_URL"

# Use PHP's built-in server with router file for proper Laravel routing
exec php -S 0.0.0.0:$PORT -t public router.php
