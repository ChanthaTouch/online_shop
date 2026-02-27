# 🚀 Complete Deployment Guide - Local & Production

## 📋 Table of Contents
1. [Local Development](#local-development)
2. [Railway Production Deployment](#railway-production-deployment)
3. [Image Issues Fix](#image-issues-fix)
4. [Testing](#testing)
5. [Troubleshooting](#troubleshooting)

---

## 🏠 Local Development

### Prerequisites
- PHP 8.2+
- Composer
- MySQL
- Node.js 18+

### Setup
```bash
# 1. Install backend dependencies
composer install

# 2. Copy environment file
cp .env.example .env

# 3. Generate app key
php artisan key:generate

# 4. Configure database in .env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=mart-system
DB_USERNAME=root
DB_PASSWORD=your_password

# 5. Run migrations
php artisan migrate

# 6. Create storage link
php artisan storage:link

# 7. Start server
php artisan serve
```

### Frontend Setup
```bash
cd frontend
npm install
npm run dev
```

---

## 🚂 Railway Production Deployment

### Step 1: Prepare Your Code

#### 1.1 Update .env.production
```env
APP_URL=https://onlineshop-production-2b86.up.railway.app
APP_ENV=production
APP_DEBUG=false
```

#### 1.2 Commit Configuration Files
```bash
git add railway.json nixpacks.toml
git commit -m "Add Railway deployment configuration"
git push
```

### Step 2: Configure Railway

#### 2.1 Environment Variables
Go to Railway Dashboard → Your Service → Variables

**Required Variables:**
```env
APP_URL=https://onlineshop-production-2b86.up.railway.app
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:8RGxGpJQ3yRk1ygDUH0G/e+vVo7V8Dt6xZBYaDqHbn8=

# Database (auto-configured by Railway MySQL)
MYSQLHOST=${{MySQL.MYSQLHOST}}
MYSQLPORT=${{MySQL.MYSQLPORT}}
MYSQLDATABASE=${{MySQL.MYSQLDATABASE}}
MYSQLUSER=${{MySQL.MYSQLUSER}}
MYSQLPASSWORD=${{MySQL.MYSQLPASSWORD}}

# Session & CORS
SESSION_DOMAIN=.railway.app
SANCTUM_STATEFUL_DOMAINS=onlineshop-production-2b86.up.railway.app
```

#### 2.2 Custom Start Command (Optional)
Settings → Deploy → Custom Start Command:
```bash
php artisan config:clear && php artisan storage:link && php artisan migrate --force && php artisan serve --host=0.0.0.0 --port=${PORT}
```

### Step 3: Deploy
1. Push your code to GitHub
2. Railway will auto-deploy
3. Wait for deployment to complete

### Step 4: Post-Deployment
After first deployment, run these commands via Railway CLI or dashboard:
```bash
railway run php artisan storage:link
railway run php artisan config:clear
railway run php artisan cache:clear
```

---

## 🖼️ Image Issues Fix

### Problem: Images Not Showing on Production

#### Cause
The `APP_URL` environment variable is not set correctly, causing Laravel to generate localhost URLs instead of production URLs.

#### Solution

**1. Set APP_URL on Railway:**
```env
APP_URL=https://onlineshop-production-2b86.up.railway.app
```

**2. Redeploy the service**

**3. Clear caches:**
```bash
railway run php artisan config:clear
railway run php artisan cache:clear
```

#### Verify Fix
Test API endpoint:
```
https://onlineshop-production-2b86.up.railway.app/api/products
```

Check that `primary_image` contains production URL:
```json
{
  "primary_image": "https://onlineshop-production-2b86.up.railway.app/storage/products/image.jpg"
}
```

---

## 🧪 Testing

### Test Local Images
```bash
# Run test script
php test-images.php

# Expected output:
# ✅ Primary Image: http://127.0.0.1:8000/storage/products/...
# ✅ File exists: YES
# ✅ Storage link exists
```

### Test Production Images
```bash
# Windows
test-production-images.bat

# Linux/Mac
chmod +x test-production-images.sh
./test-production-images.sh

# Expected output:
# ✅ SUCCESS: API is returning correct production URLs!
```

### Manual Testing

**1. Test API:**
```
https://onlineshop-production-2b86.up.railway.app/api/products
```

**2. Test Direct Image Access:**
```
https://onlineshop-production-2b86.up.railway.app/storage/products/[IMAGE_NAME].jpg
```

**3. Test Frontend:**
```
https://spirited-courtesy-production.up.railway.app
```

---

## 🐛 Troubleshooting

### Issue: Images show on localhost but not production

**Cause:** `APP_URL` not set correctly on Railway

**Fix:**
1. Railway Dashboard → Variables
2. Set `APP_URL=https://onlineshop-production-2b86.up.railway.app`
3. Redeploy

### Issue: 404 on /storage/products/image.jpg

**Cause:** Storage link not created

**Fix:**
```bash
railway run php artisan storage:link
```

Or add to start command:
```bash
php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT}
```

### Issue: Images disappear after redeploy

**Cause:** Railway's filesystem is ephemeral

**Fix:** Use Railway Volumes or cloud storage (S3)

**Railway Volumes:**
1. Dashboard → Service → Settings → Volumes
2. Add volume: Mount path `/app/storage/app/public`

**Cloud Storage (Recommended for production):**
```bash
composer require league/flysystem-aws-s3-v3
```

Update `.env`:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_BUCKET=your_bucket
```

### Issue: Mixed content errors (HTTP/HTTPS)

**Cause:** `APP_URL` using `http://` instead of `https://`

**Fix:** Ensure `APP_URL` uses `https://`

### Issue: CORS errors

**Cause:** Frontend domain not in CORS config

**Fix:** Update `config/cors.php`:
```php
'allowed_origins' => [
    'https://spirited-courtesy-production.up.railway.app',
    'https://onlineshop-production-2b86.up.railway.app',
],
```

---

## 📚 Additional Resources

### Files Created for You
- `QUICK_FIX_RAILWAY.md` - Quick 5-minute fix guide
- `RAILWAY_DEPLOYMENT_FIX.md` - Detailed Railway guide
- `COMPLETE_FIX_SUMMARY.md` - Summary of all fixes
- `IMAGE_FIX_GUIDE.md` - Image-specific troubleshooting
- `test-images.php` - Local image testing script
- `test-production-images.bat` - Production testing (Windows)
- `test-production-images.sh` - Production testing (Linux/Mac)
- `railway.json` - Railway deployment config
- `nixpacks.toml` - Nixpacks build config

### Important Commands

**Local Development:**
```bash
php artisan serve
php artisan storage:link
php artisan cache:clear
```

**Railway Production:**
```bash
railway run php artisan config:clear
railway run php artisan cache:clear
railway run php artisan storage:link
railway logs
```

---

## ✅ Deployment Checklist

### Before Deployment
- [ ] Update `.env.production` with correct `APP_URL`
- [ ] Commit `railway.json` and `nixpacks.toml`
- [ ] Test locally with `php artisan serve`
- [ ] Verify images work locally

### Railway Configuration
- [ ] Set `APP_URL` environment variable
- [ ] Set `APP_ENV=production`
- [ ] Set `APP_DEBUG=false`
- [ ] Configure database variables
- [ ] Set CORS domains

### After Deployment
- [ ] Run `php artisan storage:link`
- [ ] Run `php artisan config:clear`
- [ ] Test API endpoint
- [ ] Test direct image access
- [ ] Test frontend
- [ ] Check Railway logs for errors

### Frontend Deployment
- [ ] Update `frontend/.env.production` with API URL
- [ ] Build frontend: `npm run build`
- [ ] Copy to public: `cp -r dist/* ../public/`
- [ ] Test production frontend

---

## 🎉 Success!

When everything is working:
- ✅ Images display on localhost
- ✅ Images display on production
- ✅ API returns correct URLs
- ✅ No console errors
- ✅ Direct image URLs work

For any issues, check the troubleshooting section or the detailed guides in the repository.
