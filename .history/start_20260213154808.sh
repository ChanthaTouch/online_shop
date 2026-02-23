#!/bin/bash
# Exit immediately if a command fails
set -e

# Step 1: Build Vue frontend
cd frontend
npm install
npm run build

# Step 2: Copy built Vue assets into Laravel public folder
cp -r dist/* ../store-backend/public/

# Step 3: Start Laravel backend
cd store-backend
 composer install --no-dev --optimize-autoloader 
  php artisan migrate --force 
 php artisan serve --host=0.0.0.0 --port=8080
