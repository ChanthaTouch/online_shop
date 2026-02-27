# Admin Testing Guide

## Quick Fix Applied

### Issue Fixed
The `ProductUpload.vue` component was calling `productService.getCategories()` which didn't exist. 

### Solution
Changed to fetch categories directly from the API using:
```typescript
const { data } = await api.get('/categories')
categories.value = data
```

## Testing Steps

### 1. Create Admin User

Run this SQL in your database:
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

Or create a new admin:
```sql
INSERT INTO users (name, email, password, role, created_at, updated_at)
VALUES (
    'Admin User',
    'admin@example.com',
    '$2y$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewY5NANClx6W.7Pu',
    'admin',
    NOW(),
    NOW()
);
-- Password is: password123
```

### 2. Test Category Creation

1. Login as admin
2. Go to `/admin/categories/create`
3. Fill in:
   - Category Name: "Test Category"
   - Description: "Test description"
   - Upload an image (optional)
4. Click "Create Category"
5. Should see success message

### 3. Test Product Upload

1. Go to `/admin` (Add Product page)
2. Fill in all required fields:
   - Product Name: "Test Product"
   - Description: "Test description"
   - Price: 10.00
   - Stock: 100
   - Category: Select the category you just created
3. Upload images (optional but recommended)
4. Add discount (optional):
   - Check "Apply discount"
   - Discount Percentage: 10
   - Set start and end dates
5. Check "Product is active"
6. Click "Create Product"
7. Should see success confirmation
8. Click "OK" to go to Product Management page

### 4. Test Product Management

1. Go to `/admin/products`
2. You should see your test product in the table
3. Test Search:
   - Type product name in search box
   - Should filter results
4. Test Edit:
   - Click "Edit" button on a product
   - Change some details
   - Click "Update Product"
   - Should see success message
5. Test Delete:
   - Click "Delete" button
   - Confirm deletion
   - Product should be removed

### 5. Test Permissions

1. Logout
2. Login as regular user (non-admin)
3. Try to access `/admin`
4. Should see "Access Denied" alert
5. Should be redirected to home page

## Common Issues & Solutions

### Issue: "getCategories is not a function"
**Status:** ✅ FIXED
**Solution:** Updated ProductUpload.vue to fetch categories directly from API

### Issue: Categories not loading
**Check:**
1. Open browser console (F12)
2. Check Network tab for `/api/categories` request
3. Should return 200 status with category data
4. If 401: Check authentication token
5. If 404: Check API routes are correct

### Issue: Product upload fails
**Check:**
1. Browser console for errors
2. Network tab for `/api/products` POST request
3. Check response for validation errors
4. Common causes:
   - Missing required fields
   - Invalid category_id
   - Image file too large (max 5MB)
   - Not authenticated as admin

### Issue: Images not showing
**Status:** Known issue - ephemeral storage
**Solution:** See `IMMEDIATE_FIX.md` for Cloudinary setup

### Issue: Can't edit/delete products
**Check:**
1. Verify you're logged in as admin
2. Check browser console for errors
3. Check Network tab for API responses
4. Verify product ID exists

## API Endpoints Used

### Categories
- `GET /api/categories` - List all categories
- `POST /api/categories` - Create category (admin only)

### Products
- `GET /api/products` - List products (with pagination)
- `POST /api/products` - Create product (admin only)
- `PUT /api/products/{id}` - Update product (admin only)
- `DELETE /api/products/{id}` - Delete product (admin only)

## Success Criteria

✅ Admin can login
✅ Admin can access `/admin` routes
✅ Non-admin users are blocked from admin routes
✅ Categories load in product form
✅ Can create new products
✅ Can view all products in management page
✅ Can search products
✅ Can edit product details
✅ Can delete products
✅ Pagination works
✅ Success/error messages display correctly

## Next Steps After Testing

1. ✅ Verify all features work
2. 📸 Test image upload (will be lost on Railway restart)
3. ☁️ Set up Cloudinary for persistent images (see IMMEDIATE_FIX.md)
4. 🎨 Customize UI colors/styling if needed
5. 📊 Add more admin features (orders, users, analytics)

## Quick Commands

### Check admin users:
```sql
SELECT id, name, email, role FROM users WHERE role = 'admin';
```

### Check categories:
```sql
SELECT id, name, slug FROM categories;
```

### Check products:
```sql
SELECT id, name, price, stock, category_id FROM products LIMIT 10;
```

### Reset test data:
```sql
DELETE FROM products WHERE name LIKE 'Test%';
DELETE FROM categories WHERE name LIKE 'Test%';
```

## Support

If you encounter any issues:
1. Check browser console for JavaScript errors
2. Check Network tab for API errors
3. Check Laravel logs: `storage/logs/laravel.log`
4. Verify database connections
5. Clear browser cache and localStorage

Everything should now be working! 🎉
