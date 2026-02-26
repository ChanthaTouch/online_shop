# 🖼️ Product Images Not Showing - Complete Fix

## Problem
Images are stored correctly in `storage/app/public/products/` but not displaying in the browser.

## Root Cause
The API returns relative paths like `products/filename.jpg`, but the frontend needs full URLs like:
- Local: `http://127.0.0.1:8000/storage/products/filename.jpg`
- Production: `https://your-domain.com/storage/products/filename.jpg`

## ✅ Solution Options

### Option 1: Fix in Backend (Recommended)
Add full URLs to the API response by updating the Product model.

### Option 2: Fix in Frontend
Build the full URL in your frontend code when displaying images.

---

## 🔧 Backend Fix (Recommended)

Update `app/Models/Product.php` to return full URLs:

```php
protected function primaryImage(): Attribute
{
    return Attribute::make(
        get: fn () => isset($this->images[0])
            ? url('storage/' . ltrim($this->images[0], '/'))
            : null
    );
}

protected function imageUrls(): Attribute
{
    return Attribute::make(
        get: fn () =>
            collect($this->images ?? [])
                ->map(fn ($p) => url('storage/' . ltrim($p, '/')))
                ->toArray()
    );
}
```

This will return:
```json
{
  "primary_image": "http://127.0.0.1:8000/storage/products/filename.jpg",
  "image_urls": [
    "http://127.0.0.1:8000/storage/products/filename.jpg"
  ]
}
```

---

## 🎨 Frontend Fix (Alternative)

If you prefer to handle it in the frontend, create a helper function:

### React/Vue Example:
```javascript
// utils/imageHelper.js
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

export function getImageUrl(imagePath) {
  if (!imagePath) return '/placeholder.jpg';
  
  // If already a full URL, return as-is
  if (imagePath.startsWith('http')) return imagePath;
  
  // Build full URL
  return `${API_BASE_URL}/storage/${imagePath}`;
}
```

### Usage in Component:
```javascript
import { getImageUrl } from '@/utils/imageHelper';

// In your component
<img src={getImageUrl(product.primary_image)} alt={product.name} />
```

---

## 🔍 Verify Storage Link

Make sure the storage link exists:

```bash
# Check if link exists
ls -la public/storage

# If missing, create it
php artisan storage:link
```

The link should point to: `storage/app/public`

---

## 🧪 Test Image Access

### 1. Check if image file exists:
```bash
# Windows
dir storage\app\public\products

# Linux/Mac
ls -la storage/app/public/products
```

### 2. Test direct URL access:
Open in browser:
```
http://127.0.0.1:8000/storage/products/YOUR_IMAGE_FILENAME.jpg
```

If this works, the backend is fine and you need to fix the frontend.
If this doesn't work, check:
- Storage link exists: `public/storage` → `storage/app/public`
- File permissions (Linux/Mac): `chmod -R 755 storage/app/public`
- .htaccess is correct

---

## 🚀 Production Considerations

### Environment Variables
Make sure your `.env` has the correct APP_URL:

```env
# Local
APP_URL=http://127.0.0.1:8000

# Production
APP_URL=https://your-production-domain.com
```

### Frontend Environment
If using Vite/React/Vue, set the API URL:

```env
# .env.local (development)
VITE_API_URL=http://127.0.0.1:8000

# .env.production
VITE_API_URL=https://your-backend-domain.com
```

---

## 📋 Quick Checklist

- [ ] Storage link exists: `php artisan storage:link`
- [ ] Images exist in: `storage/app/public/products/`
- [ ] Can access image directly: `http://127.0.0.1:8000/storage/products/filename.jpg`
- [ ] APP_URL is correct in `.env`
- [ ] Frontend has correct API_URL
- [ ] Product model returns full URLs OR frontend builds them
- [ ] Clear browser cache after changes

---

## 🐛 Common Issues

### Issue: 404 Not Found for images
**Fix**: Run `php artisan storage:link`

### Issue: Images work locally but not in production
**Fix**: 
1. Update APP_URL in production `.env`
2. Run `php artisan storage:link` on production server
3. Check file permissions: `chmod -R 755 storage`

### Issue: CORS errors when loading images
**Fix**: Images should be served from same domain as API, no CORS needed.
If using CDN, add CDN domain to CORS config.

### Issue: Symlink not working on Windows
**Fix**: Run command prompt as Administrator, then:
```bash
php artisan storage:link
```

---

## 💡 Best Practice

For production, consider:
1. Using a CDN (CloudFlare, AWS CloudFront)
2. Optimizing images (WebP format, compression)
3. Lazy loading images in frontend
4. Adding image placeholders while loading
