# CORS and Timeout Fix Guide

## Issues Identified

### 1. API Timeout Errors (15 seconds)
The frontend is timing out when trying to reach:
- `/cart` - Requires authentication
- `/categories` - Public endpoint
- `/products` - Public endpoint

### 2. Root Causes
1. **Backend may be sleeping** - Railway free tier puts apps to sleep after inactivity
2. **Cart endpoint called without auth** - Header component tries to load cart even when not logged in
3. **Short timeout** - 15 seconds may not be enough for cold starts

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

### 5. Updated `frontend/src/services/api.ts`
- Increased timeout from 15 seconds to 60 seconds (for cold starts)
- Added better error logging with error codes
- Now logs full URL, error code, and helpful messages

### 6. Updated `frontend/src/components/layout/Header.vue`
- Improved error handling in `loadCartCount()`
- Now silently handles 401/403 errors (expected when not logged in)
- Only logs unexpected errors

## Deployment Steps

### Backend Deployment

1. **Commit and push changes:**
   ```bash
   git add .
   git commit -m "Fix CORS, timeout, and error handling issues"
   git push
   ```

2. **After deployment, clear cache on Railway:**
   ```bash
   php artisan config:clear
   php artisan cache:clear
   php artisan route:clear
   php artisan optimize
   ```

3. **Verify storage link exists:**
   ```bash
   php artisan storage:link
   ```

### Frontend Deployment

1. **Update environment variables on Railway:**
   - Ensure `VITE_API_URL` is set to: `https://onlineshop-production-2b86.up.railway.app/api`

2. **Rebuild and deploy:**
   ```bash
   npm run build
   ```

## Testing the Fix

1. **Test backend is running:**
   ```bash
   curl https://onlineshop-production-2b86.up.railway.app/api/categories
   ```
   Should return categories JSON (not timeout)

2. **Test frontend:**
   - Open: https://spirited-courtesy-production.up.railway.app
   - Check browser console for errors
   - Verify categories and products load
   - Check that images display correctly

3. **Test authentication flow:**
   - Login to the app
   - Verify cart loads after login
   - Check that cart count appears in header

## Troubleshooting

### If backend is still timing out:

1. **Check Railway logs:**
   - Go to Railway dashboard
   - Check if backend is running
   - Look for startup errors

2. **Wake up the backend:**
   - Visit: `https://onlineshop-production-2b86.up.railway.app/up`
   - This should wake up the app if it's sleeping

3. **Check database connection:**
   - Ensure MySQL environment variables are set correctly
   - Verify database is accessible from backend

### If CORS errors persist:

1. **Verify environment variables:**
   ```bash
   # On Railway backend
   echo $APP_URL
   # Should be: https://onlineshop-production-2b86.up.railway.app
   ```

2. **Check CORS config is loaded:**
   ```bash
   php artisan config:show cors
   ```

3. **Ensure middleware is registered:**
   ```bash
   php artisan route:list
   ```

### If images still don't load:

1. **Check storage link:**
   ```bash
   ls -la public/storage
   ```

2. **Verify images exist:**
   ```bash
   ls -la storage/app/public/
   ```

3. **Test direct image access:**
   - Visit: `https://onlineshop-production-2b86.up.railway.app/storage/[image-path]`

## Additional Notes

- **Cold Start Time**: Railway free tier apps can take 30-60 seconds to wake up
- **Timeout**: Increased to 60 seconds to handle cold starts
- **Error Handling**: Frontend now gracefully handles auth errors
- **CORS**: Properly configured for cross-origin requests

## Railway-Specific Considerations

1. **Keep-Alive**: Consider adding a cron job to ping your backend every 10 minutes to prevent sleeping
2. **Upgrade Plan**: For production, consider upgrading to a paid plan to avoid cold starts
3. **Health Check**: Railway uses `/up` endpoint for health checks (already configured)

## Next Steps

1. Deploy both frontend and backend
2. Test the application thoroughly
3. Monitor Railway logs for any errors
4. Consider setting up monitoring/alerting for downtime

