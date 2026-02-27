# Railway Deployment Checklist

## Issues Fixed

### 1. Controller Namespace Issue (CRITICAL)
- **Problem**: Routes were importing `App\Http\Controllers\AuthController` instead of `App\Http\Controllers\Api\AuthController`
- **Fix**: Updated `routes/api.php` to use correct namespace
- **Impact**: This was likely causing 500 errors when hitting auth endpoints

### 2. Production Server Configuration
- **Problem**: Using `php artisan serve` (development only) or basic `php -S` without proper routing
- **Fix**: Created `start.sh` with proper setup sequence and `router.php` for Laravel routing
- **Impact**: Prevents 502 Bad Gateway errors from server crashes

### 3. Session Configuration
- **Added**: `SESSION_SECURE_COOKIE=true` and `SESSION_SAME_SITE=none` for cross-origin requests
- **Impact**: Fixes session/cookie issues between frontend and backend on different domains

### 4. Database Connection
- **Added**: PDO timeout and error mode configuration
- **Impact**: Prevents timeout errors when connecting to Railway MySQL

### 5. Deployment Sequence
- **Fixed**: Proper order of operations in `start.sh`
- **Impact**: Ensures migrations run before caching, preventing stale config issues

## Required Railway Environment Variables

Make sure these are set in your Railway `online_shop` service:

```
MYSQLHOST=<from Railway MySQL service>
MYSQLPORT=<from Railway MySQL service>
MYSQLDATABASE=<from Railway MySQL service>
MYSQLUSER=<from Railway MySQL service>
MYSQLPASSWORD=<from Railway MySQL service>
PORT=<automatically set by Railway>
```

## Deployment Steps

1. **Commit all changes**:
```bash
git add .
git commit -m "Fix 502 error: correct controller namespaces and server config"
git push
```

2. **Monitor Railway Logs**:
   - Go to Railway dashboard
   - Click on `online_shop` service
   - Click "Logs" tab
   - Watch for:
     - "=== Starting Laravel Application ==="
     - "Running migrations..."
     - "Starting PHP built-in server..."

3. **Check for Errors**:
   - Database connection errors
   - Migration failures
   - Route cache failures

4. **Test Endpoints**:
   - Health check: `https://onlineshop-production-2b86.up.railway.app/up`
   - API test: `https://onlineshop-production-2b86.up.railway.app/api/categories`

## Files Changed

- `routes/api.php` - Fixed AuthController namespace
- `start.sh` - Improved startup script with error handling
- `router.php` - Created Laravel router for PHP built-in server
- `railway.json` - Updated build and deploy commands
- `nixpacks.toml` - Simplified configuration
- `Procfile` - Updated to use start.sh
- `.env.production` - Added session security settings
- `.railwayignore` - Exclude unnecessary files from deployment
- `config/database.php` - Added PDO timeout settings
- `app/Providers/AppServiceProvider.php` - Added database timeout configuration

## Troubleshooting

### If still getting 502 errors:

1. **Check Railway logs** for specific error messages
2. **Verify database connection** - ensure MySQL service is linked
3. **Check environment variables** - all MYSQL* variables must be set
4. **Try manual commands** in Railway shell:
   ```bash
   php artisan migrate --force
   php artisan config:cache
   php artisan route:list
   ```

### If migrations fail:

1. Check if MySQL service is running
2. Verify database credentials
3. Check if tables already exist

### If routes don't work:

1. Clear route cache: `php artisan route:clear`
2. Check `router.php` is being used
3. Verify `public/index.php` exists

## Next Steps After Successful Deployment

1. Test all API endpoints
2. Verify frontend can connect to backend
3. Test authentication flow
4. Check CORS headers are working
5. Monitor error logs for any issues
