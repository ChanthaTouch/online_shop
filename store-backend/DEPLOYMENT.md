# Deployment Notes

## Railway – CORS & API Setup

### Fixing CORS / 404 Errors

1. **Backend environment variables** (online_shop service):
   ```
   APP_URL=https://onlineshop-production-f1eb.up.railway.app
   ```
   Use your actual backend Railway URL.

2. **Frontend environment variables** (frontend service):
   ```
   VITE_API_URL=https://onlineshop-production-f1eb.up.railway.app/
   ```
   Must be set before build. In Railway: Variables tab → add `VITE_API_URL` with your backend URL (trailing slash optional).

3. **Clear config cache** (if CORS still fails):
   In Railway backend, run a one-off command or add to your start:
   ```
   php artisan config:clear && php artisan config:cache
   ```
   Or redeploy the backend so config is fresh.

4. **CORS** – `config/cors.php` already allows your frontend and `*.up.railway.app`. Redeploy backend after any `cors.php` changes.

---

## Image URLs (Railway / Production)

For product and category images to load correctly in production:

1. **Backend `APP_URL`** – See above. Use the **actual backend API URL**, not the frontend URL.

2. **Storage symlink** – The Dockerfile runs `php artisan storage:link` so `/storage/*` serves files from `storage/app/public`.

3. **Frontend `VITE_API_URL`** – See above. No `/api` suffix needed in the URL.
