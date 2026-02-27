# 🚂 Railway Deployment - Image Fix

## Problem
Images work on localhost but not on Railway production because the API is returning localhost URLs instead of production URLs.

## Root Cause
The `APP_URL` environment variable on Railway is not set correctly, so Laravel is generating URLs with `http://127.0.0.1:8000` instead of your production domain.

---

## ✅ Solution: Update Railway Environment Variables

### Step 1: Go to Railway Dashboard
1. Open https://railway.app
2. Go to your project: `onlineshop-production-2b86`
3. Click on your Laravel service

### Step 2: Set Environment Variables
Click on "Variables" tab and ensure these are set:

```env
APP_URL=https://onlineshop-production-2b86.up.railway.app
APP_ENV=production
APP_DEBUG=false
```

**CRITICAL**: Make sure `APP_URL` does NOT have a trailing slash!

### Step 3: Clear Cache on Railway
After updating environment variables, you need to clear Laravel's cache.

**Option A: Redeploy**
- Click "Deploy" → "Redeploy" in Railway dashboard
- This will restart the app with new environment variables

**Option B: Run Commands (if you have Railway CLI)**
```bash
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan storage:link
```

---

## 🔍 Verify the Fix

### Test 1: Check API Response
Open in browser:
```
https://onlineshop-production-2b86.up.railway.app/api/products
```

Look for `primary_image` field. It should show:
```json
{
  "primary_image": "https://onlineshop-production-2b86.up.railway.app/storage/products/filename.jpg"
}
```

NOT:
```json
{
  "primary_image": "http://127.0.0.1:8000/storage/products/filename.jpg"
}
```

### Test 2: Direct Image Access
Try accessing an image directly:
```
https://onlineshop-production-2b86.up.railway.app/storage/products/[IMAGE_NAME].jpg
```

If this returns 404, you need to run `php artisan storage:link` on Railway.

---

## 🛠️ Additional Railway Configuration

### Create railway.json (Optional but Recommended)
This ensures proper deployment configuration:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "composer install --no-dev --optimize-autoloader && php artisan config:cache && php artisan route:cache && php artisan view:cache"
  },
  "deploy": {
    "startCommand": "php artisan storage:link && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

### Update Nixpacks Configuration
Create or update `nixpacks.toml`:

```toml
[phases.setup]
nixPkgs = ["php82", "php82Packages.composer"]

[phases.install]
cmds = ["composer install --no-dev --optimize-autoloader"]

[phases.build]
cmds = [
  "php artisan config:cache",
  "php artisan route:cache",
  "php artisan view:cache"
]

[start]
cmd = "php artisan storage:link && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}"
```

---

## 🔐 Storage Link on Railway

Railway's filesystem is ephemeral, meaning files uploaded during runtime will be lost on redeploy. For production, you should:

### Option 1: Use Railway Volumes (Recommended)
1. In Railway dashboard, go to your service
2. Click "Settings" → "Volumes"
3. Add a volume:
   - Mount Path: `/app/storage/app/public`
   - Size: 1GB (or as needed)

### Option 2: Use Cloud Storage (Best for Production)
For permanent storage, use AWS S3, Cloudflare R2, or similar:

1. Install Laravel Flysystem S3:
```bash
composer require league/flysystem-aws-s3-v3
```

2. Update `config/filesystems.php`:
```php
'default' => env('FILESYSTEM_DISK', 's3'),
```

3. Add to Railway environment variables:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your_bucket_name
AWS_URL=https://your-bucket.s3.amazonaws.com
```

---

## 📋 Complete Railway Deployment Checklist

### Environment Variables (Railway Dashboard)
- [ ] `APP_URL=https://onlineshop-production-2b86.up.railway.app`
- [ ] `APP_ENV=production`
- [ ] `APP_DEBUG=false`
- [ ] `APP_KEY=base64:...` (your app key)
- [ ] Database variables (MYSQLHOST, MYSQLPORT, etc.)
- [ ] `SESSION_DOMAIN=.railway.app`
- [ ] `SANCTUM_STATEFUL_DOMAINS=onlineshop-production-2b86.up.railway.app`

### After Deployment
- [ ] Run `php artisan storage:link` (via start command or manually)
- [ ] Run `php artisan config:clear`
- [ ] Run `php artisan cache:clear`
- [ ] Test API endpoint: `/api/products`
- [ ] Test direct image access: `/storage/products/[image].jpg`
- [ ] Test frontend: Images should display

### Frontend Configuration
Update `frontend/.env.production`:
```env
VITE_API_URL=https://onlineshop-production-2b86.up.railway.app/api
```

Then rebuild frontend:
```bash
cd frontend
npm run build
cp -r dist/* ../public/
```

---

## 🐛 Troubleshooting

### Images still showing localhost URLs?
**Fix**: Clear config cache on Railway
```bash
railway run php artisan config:clear
railway run php artisan config:cache
```

### 404 on /storage/products/image.jpg?
**Fix**: Storage link not created
```bash
railway run php artisan storage:link
```

### Images disappear after redeploy?
**Fix**: Use Railway Volumes or cloud storage (S3)

### Mixed content errors (HTTP/HTTPS)?
**Fix**: Ensure `APP_URL` uses `https://` not `http://`

---

## 🚀 Quick Fix Commands

If you have Railway CLI installed:

```bash
# Set environment variable
railway variables set APP_URL=https://onlineshop-production-2b86.up.railway.app

# Clear caches
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan storage:link

# Redeploy
railway up
```

---

## 📞 Still Not Working?

### Check Laravel Logs on Railway
```bash
railway logs
```

Look for errors related to:
- Storage
- Configuration
- Image URLs

### Test Environment Variable
```bash
railway run php artisan tinker --execute="echo config('app.url');"
```

Should output:
```
https://onlineshop-production-2b86.up.railway.app
```

If it shows `http://127.0.0.1:8000`, the environment variable is not set correctly.

---

## ✅ Success Indicators

You'll know it's fixed when:
- ✅ API returns full production URLs
- ✅ Images load on production frontend
- ✅ No 404 errors for images
- ✅ No mixed content warnings
- ✅ Direct image URLs work

The key is ensuring `APP_URL` is set correctly on Railway and caches are cleared after changes.
