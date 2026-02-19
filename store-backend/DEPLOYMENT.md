# Deployment Notes

## Image URLs (Railway / Production)

For product and category images to load correctly in production:

1. **Backend `APP_URL`** – In your Railway (or hosting) environment variables, set:
   ```
   APP_URL=https://your-backend-url.up.railway.app
   ```
   Use the **actual backend API URL**, not the frontend URL. This is used by Laravel `asset()` for `primary_image` and `image_urls`.

2. **Storage symlink** – The Dockerfile runs `php artisan storage:link` so `/storage/*` serves files from `storage/app/public`.

3. **Frontend `VITE_API_URL`** – In your frontend `.env` (or Railway frontend env), set:
   ```
   VITE_API_URL=https://your-backend-url.up.railway.app/
   ```
   The frontend uses this to build image URLs from raw paths. No `/api` suffix needed.

4. **CORS** – Ensure `config/cors.php` allows your frontend origin for both API and image requests.
