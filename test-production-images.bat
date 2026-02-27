@echo off
echo 🧪 Testing Production Image URLs
echo ==================================
echo.

set PROD_URL=https://onlineshop-production-2b86.up.railway.app

echo 📡 Fetching product data from production API...
echo URL: %PROD_URL%/api/products
echo.

curl -s "%PROD_URL%/api/products" > temp_response.json

echo Response preview:
type temp_response.json | more
echo.

findstr /C:"127.0.0.1" temp_response.json >nul
if %errorlevel% equ 0 (
    echo ❌ PROBLEM FOUND: API is returning localhost URLs!
    echo.
    echo The API response contains '127.0.0.1' which means APP_URL is not set correctly on Railway.
    echo.
    echo 🔧 FIX:
    echo 1. Go to Railway dashboard
    echo 2. Select your service
    echo 3. Go to Variables tab
    echo 4. Set: APP_URL=https://onlineshop-production-2b86.up.railway.app
    echo 5. Redeploy the service
    echo.
) else (
    findstr /C:"%PROD_URL%/storage" temp_response.json >nul
    if %errorlevel% equ 0 (
        echo ✅ SUCCESS: API is returning correct production URLs!
        echo.
        echo Image URLs are using: %PROD_URL%/storage/...
        echo.
    ) else (
        echo ⚠️  Could not determine image URL format
        echo Response might be empty or in unexpected format
    )
)

del temp_response.json

echo.
echo ==================================
echo Test complete!
pause
