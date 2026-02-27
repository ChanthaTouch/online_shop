# Image Storage Issue on Railway

## The Problem

Railway uses **ephemeral filesystem** - any files uploaded to `storage/app/public` will be **deleted when the service restarts or redeploys**. This is why your product images disappear.

## Current Temporary Solution

The `/storage/{path}` route in `routes/web.php` serves files from `storage/app/public/`. This works temporarily but files will be lost on restart.

## Permanent Solutions

### Option 1: Use Cloudinary (Recommended - Free Tier Available)

1. **Sign up for Cloudinary**: https://cloudinary.com (Free: 25GB storage, 25GB bandwidth/month)

2. **Install Cloudinary package**:
```bash
composer require cloudinary-labs/cloudinary-laravel
```

3. **Add to `.env.production`**:
```env
CLOUDINARY_URL=cloudinary://API_KEY:API_SECRET@CLOUD_NAME
FILESYSTEM_DISK=cloudinary
```

4. **Update `config/filesystems.php`**:
```php
'cloudinary' => [
    'driver' => 'cloudinary',
    'api_key' => env('CLOUDINARY_API_KEY'),
    'api_secret' => env('CLOUDINARY_API_SECRET'),
    'cloud_name' => env('CLOUDINARY_CLOUD_NAME'),
],
```

5. **Update ProductController** - change:
```php
$image->store('products', 'public')
```
to:
```php
$image->store('products', 'cloudinary')
```

### Option 2: Use AWS S3

1. **Create S3 bucket** on AWS

2. **Install AWS SDK**:
```bash
composer require league/flysystem-aws-s3-v3 "^3.0"
```

3. **Add to `.env.production`**:
```env
FILESYSTEM_DISK=s3
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AWS_DEFAULT_REGION=us-east-1
AWS_BUCKET=your-bucket-name
AWS_URL=https://your-bucket.s3.amazonaws.com
```

4. **Update ProductController** - change:
```php
$image->store('products', 'public')
```
to:
```php
$image->store('products', 's3')
```

### Option 3: Railway Volumes (Persistent Storage)

1. **In Railway Dashboard**:
   - Go to your service
   - Click "Variables" tab
   - Add a Volume
   - Mount path: `/app/storage/app/public`

2. **Note**: Volumes cost extra on Railway

## Quick Test

To test if images are being stored correctly:

1. **Check storage directory**:
```bash
railway run ls -la storage/app/public/products
```

2. **Test image URL**:
```
https://onlineshop-production-2b86.up.railway.app/storage/products/your-image.jpg
```

## Current Status

- ✅ Backend is working
- ✅ Image upload works temporarily
- ❌ Images are lost on restart (ephemeral filesystem)
- 🔧 Need to implement cloud storage for persistence

## Recommended Next Steps

1. Sign up for Cloudinary (free tier)
2. Install cloudinary-laravel package
3. Update ProductController to use Cloudinary
4. Update frontend to handle Cloudinary URLs
5. Test image upload and persistence
