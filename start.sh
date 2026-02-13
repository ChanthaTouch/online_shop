#!/bin/bash
# Exit immediately if a command fails
set -e

# Step 1: Start Laravel backend only
cd store-backend
composer install --no-dev --optimize-autoloader
php artisan migrate --force
php artisan serve --host=0.0.0.0 --port=8000
