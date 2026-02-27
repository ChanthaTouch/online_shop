#!/bin/bash

echo "🧪 Testing Production Image URLs"
echo "=================================="
echo ""

PROD_URL="https://onlineshop-production-2b86.up.railway.app"

echo "📡 Fetching product data from production API..."
echo "URL: $PROD_URL/api/products"
echo ""

# Fetch first product and extract image URL
RESPONSE=$(curl -s "$PROD_URL/api/products" | head -c 5000)

echo "Response preview:"
echo "$RESPONSE" | head -c 500
echo ""
echo "..."
echo ""

# Check if response contains localhost URLs (BAD)
if echo "$RESPONSE" | grep -q "127.0.0.1"; then
    echo "❌ PROBLEM FOUND: API is returning localhost URLs!"
    echo ""
    echo "The API response contains '127.0.0.1' which means APP_URL is not set correctly on Railway."
    echo ""
    echo "🔧 FIX:"
    echo "1. Go to Railway dashboard"
    echo "2. Select your service"
    echo "3. Go to Variables tab"
    echo "4. Set: APP_URL=https://onlineshop-production-2b86.up.railway.app"
    echo "5. Redeploy the service"
    echo ""
elif echo "$RESPONSE" | grep -q "$PROD_URL/storage"; then
    echo "✅ SUCCESS: API is returning correct production URLs!"
    echo ""
    echo "Image URLs are using: $PROD_URL/storage/..."
    echo ""
    
    # Extract an image URL to test
    IMAGE_URL=$(echo "$RESPONSE" | grep -o "$PROD_URL/storage/products/[^\"]*" | head -1)
    
    if [ -n "$IMAGE_URL" ]; then
        echo "📸 Testing direct image access..."
        echo "URL: $IMAGE_URL"
        echo ""
        
        HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$IMAGE_URL")
        
        if [ "$HTTP_CODE" = "200" ]; then
            echo "✅ Image is accessible! (HTTP $HTTP_CODE)"
        else
            echo "❌ Image not accessible! (HTTP $HTTP_CODE)"
            echo ""
            echo "🔧 FIX: Run on Railway:"
            echo "   php artisan storage:link"
        fi
    fi
else
    echo "⚠️  Could not determine image URL format"
    echo "Response might be empty or in unexpected format"
fi

echo ""
echo "=================================="
echo "Test complete!"
