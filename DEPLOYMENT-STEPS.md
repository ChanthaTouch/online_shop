# Deployment Steps for Railway

## Changes Made

### 1. Frontend Configuration
- Updated `frontend/.env` to use new Railway backend URL:
  ```
  VITE_API_URL=https://chantha-drink-delivery-production.up.railway.app/api
  ```

### 2. Backend Configuration
- Updated `.env.production` with new Railway URL:
  ```
  APP_URL=https://chantha-drink-delivery-production.up.railway.app
  ```
- Added new domain to `SANCTUM_STATEFUL_DOMAINS`

### 3. CORS Configuration
- Updated `config/cors.php` to allow requests from new Railway domain:
  ```
  https://chantha-drink-delivery-production.up.railway.app
  ```

## Deployment Instructions

### For Backend (Laravel)
1. Push your changes to GitHub
2. Railway will automatically detect the changes and redeploy
3. Or manually trigger a redeploy in Railway dashboard

### For Frontend (Vue.js)
1. Rebuild the frontend with the new environment variable:
   ```bash
   cd frontend
   npm run build
   ```

2. The built files will be in `frontend/dist/`

3. Deploy options:
   - **Option A: Railway Static Site**
     - Create a new Railway service
     - Connect to your GitHub repo
     - Set root directory to `frontend`
     - Set build command: `npm install && npm run build`
     - Set start command: `npx serve -s dist -l $PORT`
   
   - **Option B: Serve from Laravel**
     - Copy `frontend/dist/*` to `public/` directory
     - Access via: `https://chantha-drink-delivery-production.up.railway.app`

## Verification Steps

1. Check backend is running:
   ```
   https://chantha-drink-delivery-production.up.railway.app/api/categories
   ```

2. Check frontend can connect to backend:
   - Open browser console
   - Look for API requests to the correct URL
   - Verify no CORS errors

3. Test functionality:
   - Browse categories
   - View products
   - Filter by category
   - View product details

## Troubleshooting

### CORS Errors
- Verify `config/cors.php` includes your frontend domain
- Check `.env.production` has correct `SANCTUM_STATEFUL_DOMAINS`
- Clear Laravel cache: `php artisan config:clear`

### Images Not Loading
- Verify storage is linked: `php artisan storage:link`
- Check image URLs in browser console
- Ensure `APP_URL` is correct in `.env.production`

### API Connection Failed
- Verify `VITE_API_URL` in `frontend/.env`
- Check Railway logs for backend errors
- Ensure backend service is running
