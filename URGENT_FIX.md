# URGENT: Backend is DOWN (502 Bad Gateway)

## Current Problem
Your backend at `https://onlineshop-production-2b86.up.railway.app` is returning **502 Bad Gateway**.

This means:
- The backend container crashed
- The backend failed to start
- Railway can't reach your application

## Quick Fix Steps

### 1. Check Railway Logs
Go to Railway dashboard and check the deployment logs for errors:
- Look for startup errors
- Check for database connection issues
- Look for missing environment variables

### 2. Common Issues

#### A. Database Connection
Make sure these environment variables are set in Railway:
```
DB_CONNECTION=mysql
DB_HOST=${MYSQLHOST}
DB_PORT=${MYSQLPORT}
DB_DATABASE=${MYSQLDATABASE}
DB_USERNAME=${MYSQLUSER}
DB_PASSWORD=${MYSQLPASSWORD}
```

#### B. Port Configuration
Railway assigns a random PORT. Make sure your app uses it:
```
PORT=${PORT}
```

#### C. APP_KEY
Make sure APP_KEY is set:
```
APP_KEY=base64:8RGxGpJQ3yRk1ygDUH0G/e+vVo7V8Dt6xZBYaDqHbn8=
```

### 3. Redeploy Backend

#### Option A: Use Dockerfile (Recommended)
I've updated `railway.json` to use Dockerfile instead of nixpacks.

```bash
git add .
git commit -m "Fix Railway deployment - use Dockerfile"
git push
```

#### Option B: Use Simple PHP Server
If Dockerfile fails, try using PHP's built-in server:

Update `railway.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}"
  }
}
```

### 4. Test Backend Manually

After deployment, test these endpoints:

```bash
# Health check
curl https://onlineshop-production-2b86.up.railway.app/up

# Categories (should return JSON)
curl https://onlineshop-production-2b86.up.railway.app/api/categories

# Products (should return JSON)
curl https://onlineshop-production-2b86.up.railway.app/api/products
```

### 5. Check Environment Variables

Make sure these are set in Railway:

**Required:**
- `APP_KEY` - Your Laravel app key
- `APP_ENV=production`
- `APP_DEBUG=false`
- `APP_URL=https://onlineshop-production-2b86.up.railway.app`
- `PORT=${PORT}` (Railway provides this)

**Database (if using MySQL):**
- `DB_CONNECTION=mysql`
- `DB_HOST=${MYSQLHOST}`
- `DB_PORT=${MYSQLPORT}`
- `DB_DATABASE=${MYSQLDATABASE}`
- `DB_USERNAME=${MYSQLUSER}`
- `DB_PASSWORD=${MYSQLPASSWORD}`

**Or use SQLite for testing:**
- `DB_CONNECTION=sqlite`
- `DB_DATABASE=/app/database/database.sqlite`

### 6. Simplify Deployment (Emergency)

If nothing works, create a minimal deployment:

1. Remove complex build steps
2. Use SQLite instead of MySQL
3. Skip frontend build
4. Use PHP built-in server

Create `railway-simple.json`:
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "touch database/database.sqlite && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}"
  }
}
```

## What I Changed

1. **railway.json** - Changed from NIXPACKS to DOCKERFILE
2. **Dockerfile** - Fixed port configuration to use Railway's PORT variable
3. **CORS config** - Already fixed in previous changes

## Next Steps

1. **Check Railway logs** - Find the actual error
2. **Redeploy** - Push the changes
3. **Test endpoints** - Verify backend is responding
4. **Check frontend** - Once backend is up, frontend should work

## If Still Not Working

Share the Railway deployment logs with me and I'll help debug the specific error.

Common log locations in Railway:
- Build logs - Shows if build succeeded
- Deploy logs - Shows startup errors
- Runtime logs - Shows application errors
