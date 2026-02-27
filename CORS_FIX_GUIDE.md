# CORS and Image Loading Fix

## Issues Fixed
1. CORS errors blocking requests from frontend to backend
2. Failed resource loading (CSS, JS, images)
3. Mixed content warnings (HTTP vs HTTPS)

## Changes Made

### 1. Updated `config/cors.php`
- Added `Content-Type` and `Accept` to exposed headers
- Changed `supports_credentials` to `true` to allow cross-origin requests with credentials

### 2. Updated `bootstrap/app.php`
- Added `HandleCors` middleware globally to handle preflight OPTIONS requests
- This ensures CORS headers are sent for all requests

### 3. Updated `.env.production`
- Added frontend domain to `SANCTUM_STATEFUL_DOMAINS`
- Now includes: `onlineshop-production-2b86.up.railway.app,spirited-courtesy-production.up.railway.app`

### 4. Updated `routes/web.php`
- Added explicit storage route with CORS headers
- This ensures images served from `/storage/` path have proper CORS headers

## Deployment Steps

1. **Deploy Backend Changes:**
   ```bash
   git add .
   git commit -m "Fix CORS and image loading issues"
   git push
   ```

2. **Clear Cache on Production:**
   After deployment, run these commands on your Railway backend:
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   ```

3. **Verify Storage Link:**
   Ensure the storage link exists:
   ```bash
   php artisan storage:link
   ```

4. **Test the Fix:**
   - Open your frontend: https://spirited-courtesy-production.up.railway.app
   - Check browser console for CORS errors (should be gone)
   - Verify images load correctly
   - Check that API requests work properly

## Additional Notes

- The `frontend/src/utils/image.ts` already handles HTTPS conversion in production
- CORS is now configured to allow requests from your frontend domain
- Storage files are served with proper CORS headers
- Credentials are enabled for cross-origin requests (needed for authentication)

## If Issues Persist

1. Check that Railway environment variables match `.env.production`
2. Verify the frontend is using the correct `VITE_API_URL`
3. Check browser console for specific error messages
4. Ensure both frontend and backend are using HTTPS
