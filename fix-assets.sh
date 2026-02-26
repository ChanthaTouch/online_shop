#!/bin/bash

echo "🔧 Fixing asset loading issues..."

# Step 1: Clear Laravel caches
echo "📦 Clearing Laravel caches..."
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

# Step 2: Check if frontend directory exists
if [ -d "frontend" ]; then
    echo "🏗️  Rebuilding frontend assets..."
    cd frontend
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ]; then
        echo "📥 Installing frontend dependencies..."
        npm install
    fi
    
    # Build frontend
    echo "🔨 Building frontend..."
    npm run build
    
    # Copy to public directory
    echo "📋 Copying built files to public directory..."
    cp -r dist/* ../public/
    
    cd ..
else
    echo "⚠️  Frontend directory not found. Skipping frontend build."
fi

# Step 3: Set proper permissions
echo "🔐 Setting proper permissions..."
chmod -R 755 public/assets
chmod 644 public/index.html

echo "✅ Done! Now:"
echo "   1. Clear your browser cache (Ctrl+Shift+Delete)"
echo "   2. Hard refresh the page (Ctrl+Shift+R)"
echo "   3. Or open in incognito/private window"
echo ""
echo "   If still seeing errors, disable ad blocker extensions."
