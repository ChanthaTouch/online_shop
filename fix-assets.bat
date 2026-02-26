@echo off
echo 🔧 Fixing asset loading issues...

REM Step 1: Clear Laravel caches
echo 📦 Clearing Laravel caches...
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear

REM Step 2: Check if frontend directory exists
if exist "frontend" (
    echo 🏗️  Rebuilding frontend assets...
    cd frontend
    
    REM Install dependencies if needed
    if not exist "node_modules" (
        echo 📥 Installing frontend dependencies...
        call npm install
    )
    
    REM Build frontend
    echo 🔨 Building frontend...
    call npm run build
    
    REM Copy to public directory
    echo 📋 Copying built files to public directory...
    xcopy /E /I /Y dist\* ..\public\
    
    cd ..
) else (
    echo ⚠️  Frontend directory not found. Skipping frontend build.
)

echo ✅ Done! Now:
echo    1. Clear your browser cache (Ctrl+Shift+Delete)
echo    2. Hard refresh the page (Ctrl+Shift+R)
echo    3. Or open in incognito/private window
echo.
echo    If still seeing errors, disable ad blocker extensions.
pause
