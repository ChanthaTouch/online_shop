#!/bin/bash

# Test Backend Connectivity Script
# This script tests if your Laravel backend is accessible and responding

BACKEND_URL="https://onlineshop-production-2b86.up.railway.app"
API_URL="${BACKEND_URL}/api"

echo "🔍 Testing Backend Connectivity..."
echo "=================================="
echo ""

# Test 1: Health Check
echo "1️⃣ Testing health endpoint..."
HEALTH_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${BACKEND_URL}/up")
if [ "$HEALTH_RESPONSE" = "200" ]; then
    echo "✅ Health check passed (200 OK)"
else
    echo "❌ Health check failed (HTTP $HEALTH_RESPONSE)"
fi
echo ""

# Test 2: Categories Endpoint
echo "2️⃣ Testing /api/categories endpoint..."
CATEGORIES_RESPONSE=$(curl -s -w "\nHTTP_CODE:%{http_code}" "${API_URL}/categories")
HTTP_CODE=$(echo "$CATEGORIES_RESPONSE" | grep "HTTP_CODE" | cut -d: -f2)
if [ "$HTTP_CODE" = "200" ]; then
    echo "✅ Categories endpoint working (200 OK)"
    echo "Response preview:"
    echo "$CATEGORIES_RESPONSE" | grep -v "HTTP_CODE" | head -n 5
else
    echo "❌ Categories endpoint failed (HTTP $HTTP_CODE)"
    echo "Response:"
    echo "$CATEGORIES_RESPONSE" | grep -v "HTTP_CODE"
fi
echo ""

# Test 3: Products Endpoint
echo "3️⃣ Testing /api/products endpoint..."
PRODUCTS_RESPONSE=$(curl -s -o /dev/null -w "%{http_code}" "${API_URL}/products")
if [ "$PRODUCTS_RESPONSE" = "200" ]; then
    echo "✅ Products endpoint working (200 OK)"
else
    echo "❌ Products endpoint failed (HTTP $PRODUCTS_RESPONSE)"
fi
echo ""

# Test 4: CORS Headers
echo "4️⃣ Testing CORS headers..."
CORS_HEADERS=$(curl -s -I -X OPTIONS "${API_URL}/categories" \
    -H "Origin: https://spirited-courtesy-production.up.railway.app" \
    -H "Access-Control-Request-Method: GET" | grep -i "access-control")

if [ -n "$CORS_HEADERS" ]; then
    echo "✅ CORS headers present:"
    echo "$CORS_HEADERS"
else
    echo "❌ No CORS headers found"
fi
echo ""

# Test 5: Response Time
echo "5️⃣ Testing response time..."
START_TIME=$(date +%s%N)
curl -s -o /dev/null "${API_URL}/categories"
END_TIME=$(date +%s%N)
DURATION=$((($END_TIME - $START_TIME) / 1000000))

if [ $DURATION -lt 5000 ]; then
    echo "✅ Fast response: ${DURATION}ms"
elif [ $DURATION -lt 15000 ]; then
    echo "⚠️  Slow response: ${DURATION}ms (may cause timeouts)"
else
    echo "❌ Very slow response: ${DURATION}ms (will timeout)"
fi
echo ""

echo "=================================="
echo "✨ Test complete!"
