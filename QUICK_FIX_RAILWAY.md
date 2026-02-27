# 🚀 Quick Fix for Railway Images

## The Problem
Images work on localhost but not on Railway because the API is returning `http://127.0.0.1:8000` URLs instead of your production domain.

---

## ⚡ Quick Fix (5 minutes)

### Step 1: Update Railway Environment Variable
1. Go to https://railway.app
2. Open your project: **onlineshop-production-2b86**
3. Click on your **Laravel service**
4. Click **"Variables"** tab
5. Find or add `APP_URL` and set it to:
   ```
   https://onlineshop-production-2b86.up.railway.app
   ```
   ⚠️ **Important**: No trailing slash!

### Step 2: Redeploy
1. Click **"Settings"** tab
2. Scroll down and click **"Redeploy"**
3. Wait for deployment to complete (~2-3 minutes)

### Step 3: Test
Open your production site:
```
https://spirited-courtesy-production.up.railway.app
```

Images should now display! 🎉

---

## 🧪 Verify It's Fixed

### Test the API
Open in browser:
```
https://onlineshop-production-2b86.up.railway.app/api/products
```

Look for `primary_image` - it should show:
```json
"primary_image": "https://onlineshop-production-2b86.up.railway.app/storage/products/..."
```

NOT:
```json
"primary_image": "http://127.0.0.1:8000/storage/products/..."
```

---

## 🔧 If Still Not Working

### Option 1: Clear Cache Manually
If you have Railway CLI:
```bash
railway run php artisan config:clear
railway run php artisan cache:clear
```

### Option 2: Add to Start Command
Update your Railway start command to:
```bash
php artisan config:clear && php artisan storage:link && php artisan serve --host=0.0.0.0 --port=${PORT}
```

To update start command:
1. Railway Dashboard → Your Service
2. Settings → Deploy
3. Custom Start Command → Enter the command above
4. Redeploy

---

## 📋 Railway Environment Variables Checklist

Make sure these are set in Railway:

```env
APP_URL=https://onlineshop-production-2b86.up.railway.app
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:8RGxGpJQ3yRk1ygDUH0G/e+vVo7V8Dt6xZBYaDqHbn8=
```

---

## ✅ That's It!

After setting `APP_URL` correctly and redeploying, your images should work on production.

The key issue was that Laravel was using the default `APP_URL` (localhost) to generate image URLs. By setting it to your production domain, all URLs will be generated correctly.
