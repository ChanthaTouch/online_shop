# Quick Reference Card

## 🔑 Create Admin User
```sql
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

## 🌐 Admin URLs
- Add Product: `https://your-site.com/admin`
- Manage Products: `https://your-site.com/admin/products`
- Create Category: `https://your-site.com/admin/categories/create`
- Special Offers: `https://your-site.com/admin/discounts`

## 📝 Admin Features

### Product Management
| Action | Location | Description |
|--------|----------|-------------|
| Create | `/admin` | Upload new products with images |
| View All | `/admin/products` | See all products in table |
| Edit | `/admin/products` | Click "Edit" button |
| Delete | `/admin/products` | Click "Delete" button |
| Search | `/admin/products` | Use search box |

### Category Management
| Action | Location | Description |
|--------|----------|-------------|
| Create | `/admin/categories/create` | Add new category |
| Upload Image | Category form | Drag & drop or click |

## 🐛 Quick Fixes

### "Access Denied"
```sql
-- Check user role
SELECT id, name, email, role FROM users WHERE email = 'your-email@example.com';

-- Fix if needed
UPDATE users SET role = 'admin' WHERE email = 'your-email@example.com';
```

### Categories Not Loading
```javascript
// Check in browser console (F12)
// Should see: GET /api/categories → 200 OK
```

### Images Not Showing
```
This is normal on Railway (ephemeral storage)
Solution: Set up Cloudinary (see IMMEDIATE_FIX.md)
```

## 🔧 Useful Commands

### Check Admin Users
```sql
SELECT id, name, email, role FROM users WHERE role = 'admin';
```

### Check Products
```sql
SELECT id, name, price, stock FROM products ORDER BY created_at DESC LIMIT 10;
```

### Check Categories
```sql
SELECT id, name, slug FROM categories;
```

### Reset Test Data
```sql
DELETE FROM products WHERE name LIKE 'Test%';
DELETE FROM categories WHERE name LIKE 'Test%';
```

## 📊 API Endpoints

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create (admin)
- `PUT /api/products/{id}` - Update (admin)
- `DELETE /api/products/{id}` - Delete (admin)

### Categories
- `GET /api/categories` - List categories
- `POST /api/categories` - Create (admin)

## 🎨 File Locations

### Frontend
- Product Upload: `frontend/src/views/Admin/ProductUpload.vue`
- Product Management: `frontend/src/views/Admin/ProductManagement.vue`
- Category Create: `frontend/src/views/Admin/CategoryCreate.vue`
- Admin Layout: `frontend/src/components/layout/AdminLayout.vue`
- Router: `frontend/src/router/index.ts`
- Product Service: `frontend/src/services/products.ts`

### Backend
- Product Controller: `app/Http/Controllers/ProductController.php`
- Category Controller: `app/Http/Controllers/CategoryController.php`
- User Model: `app/Models/User.php`
- Auth Provider: `app/Providers/AuthServiceProvider.php`
- API Routes: `routes/api.php`

## 🚀 Deployment

### Railway
```bash
git add .
git commit -m "Update admin features"
git push
```

### Check Logs
```bash
# In Railway dashboard
Click "Logs" tab
```

## 📚 Documentation Files

- `FINAL_SUMMARY.md` - Complete overview
- `ADMIN_TESTING_GUIDE.md` - Testing steps
- `ADMIN_SETUP_COMPLETE.md` - Setup guide
- `IMMEDIATE_FIX.md` - Image storage fix
- `create-admin-user.sql` - SQL scripts

## ⚡ Quick Test

1. Create admin user (SQL above)
2. Login at `/login`
3. Go to `/admin`
4. Create a category
5. Create a product
6. Go to `/admin/products`
7. Edit/Delete product

## 🎯 Success Indicators

✅ Can access `/admin` routes
✅ Categories load in dropdown
✅ Can create products
✅ Can see products in table
✅ Can edit products
✅ Can delete products
✅ Search works
✅ Pagination works
✅ Non-admin users blocked

## 🆘 Emergency Reset

```sql
-- Reset admin user
UPDATE users SET role = 'customer' WHERE email = 'user@example.com';
UPDATE users SET role = 'admin' WHERE email = 'admin@example.com';

-- Clear test data
DELETE FROM products WHERE created_at > DATE_SUB(NOW(), INTERVAL 1 HOUR);
```

---

**Everything working?** ✅ You're all set!
**Having issues?** 🐛 Check `ADMIN_TESTING_GUIDE.md`
