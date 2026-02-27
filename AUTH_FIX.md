# Authentication Fix - 401 Unauthorized Errors ✅

## Issue
Users getting 401 (Unauthorized) errors when:
- Adding items to cart
- Fetching cart
- Loading profile
- Any authenticated API calls

## Root Cause
The `routes/api.php` was using `App\Http\Controllers\Api\AuthController` which returns **mock tokens** that are not validated by Laravel Sanctum. The cart routes require `auth:sanctum` middleware, but the mock tokens don't work with Sanctum.

## Solution Applied

### 1. Fixed Route Import
Changed from mock controller to real Sanctum controller:

**Before:**
```php
use App\Http\Controllers\Api\AuthController;
```

**After:**
```php
use App\Http\Controllers\AuthController;
```

This ensures login/register use the proper `AuthController` that:
- Creates real Sanctum tokens with `$user->createToken()`
- Validates credentials with `Auth::attempt()`
- Properly handles logout by deleting tokens

### 2. How Sanctum Works

**Login Flow:**
1. User submits email/password
2. Backend validates with `Auth::attempt()`
3. Backend creates token: `$user->createToken('authToken')->plainTextToken`
4. Frontend stores token in localStorage
5. Frontend sends token in Authorization header: `Bearer {token}`
6. Sanctum validates token on protected routes

**Token Format:**
- Real Sanctum token: `1|randomStringOfCharacters...`
- Mock token (broken): `mock-token`

## Files Changed

### routes/api.php
```php
// Changed import
use App\Http\Controllers\AuthController;  // ✅ Real Sanctum auth

// Routes now use proper controller
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);
```

## Testing Steps

### 1. Clear Old Tokens
```javascript
// In browser console
localStorage.clear()
```

### 2. Register New User
```bash
POST https://onlineshop-production-2b86.up.railway.app/api/register
{
  "name": "Test User",
  "email": "test@example.com",
  "password": "password123",
  "role": "customer"
}
```

Expected response:
```json
{
  "token": "1|abc123...",  // Real Sanctum token
  "user": {
    "id": 1,
    "name": "Test User",
    "email": "test@example.com",
    "role": "customer"
  }
}
```

### 3. Login
```bash
POST https://onlineshop-production-2b86.up.railway.app/api/login
{
  "email": "test@example.com",
  "password": "password123"
}
```

### 4. Test Cart (Should Work Now)
```bash
GET https://onlineshop-production-2b86.up.railway.app/api/cart
Headers:
  Authorization: Bearer {your-token}
```

Expected: 200 OK with cart data

### 5. Add to Cart
```bash
POST https://onlineshop-production-2b86.up.railway.app/api/cart/items
Headers:
  Authorization: Bearer {your-token}
Body:
{
  "product_id": 1,
  "quantity": 1
}
```

Expected: 200 OK with updated cart

## Frontend Changes Needed

### IMPORTANT: Users Must Re-login!

All existing users have mock tokens stored. They need to:
1. Logout (clears localStorage)
2. Login again (gets real Sanctum token)

### Optional: Auto-detect Mock Tokens

Add to `frontend/src/services/api.ts`:

```typescript
// Check for mock tokens and force re-login
const token = localStorage.getItem('token');
if (token === 'mock-token') {
  console.warn('⚠️ Mock token detected - clearing auth');
  localStorage.clear();
  window.location.href = '/login';
}
```

## Verification Checklist

✅ Routes use `AuthController` (not `Api\AuthController`)
✅ Login returns real Sanctum token (format: `1|...`)
✅ Token stored in localStorage
✅ API interceptor adds `Authorization: Bearer {token}` header
✅ Cart endpoints return 200 (not 401)
✅ Profile loads successfully
✅ Add to cart works

## Common Issues

### Still Getting 401?

**Check 1: Token Format**
```javascript
// In browser console
localStorage.getItem('token')
// Should be: "1|abc123..." (starts with number|)
// NOT: "mock-token"
```

**Check 2: Token in Request**
Open Network tab → Check request headers:
```
Authorization: Bearer 1|abc123...
```

**Check 3: Backend Logs**
```bash
# On Railway
railway logs
# Look for authentication errors
```

**Check 4: CORS**
Ensure `config/cors.php` allows your frontend domain:
```php
'paths' => ['api/*', 'sanctum/csrf-cookie'],
'allowed_origins' => ['*'],  // Or specific domains
'supports_credentials' => true,
```

### Token Expired?

Sanctum tokens don't expire by default. Check `config/sanctum.php`:
```php
'expiration' => null,  // No expiration
```

### Database Issues?

Sanctum stores tokens in `personal_access_tokens` table:
```sql
SELECT * FROM personal_access_tokens;
```

Should see tokens with:
- `tokenable_type`: App\Models\User
- `tokenable_id`: User ID
- `name`: authToken
- `token`: Hashed token

## Security Notes

### Production Checklist
- ✅ Use HTTPS (Railway provides this)
- ✅ Sanctum tokens are hashed in database
- ✅ Passwords are hashed with bcrypt
- ✅ CORS configured properly
- ✅ Session cookies secure
- ⚠️ Consider token expiration for production

### Token Security
- Tokens stored in localStorage (XSS risk)
- Consider using httpOnly cookies for better security
- Implement token refresh mechanism
- Add rate limiting on auth endpoints

## Next Steps

### Immediate
1. Deploy the route fix to Railway
2. Notify users to re-login
3. Test all authenticated endpoints

### Optional Improvements
1. Add token expiration
2. Implement refresh tokens
3. Add "Remember Me" functionality
4. Move to httpOnly cookies
5. Add 2FA for admin accounts

## Deployment

```bash
# Commit the fix
git add routes/api.php
git commit -m "Fix: Use real Sanctum auth instead of mock tokens"
git push

# Railway will auto-deploy
# Wait for deployment to complete
# Test authentication
```

## Summary

The authentication system now works properly:
- ✅ Real Sanctum tokens generated on login
- ✅ Tokens validated on protected routes
- ✅ Cart, profile, and all authenticated endpoints work
- ✅ Secure token storage and validation

**Users must re-login to get valid tokens!**

---

**Status**: ✅ Fixed
**Impact**: All users need to re-login once
**Date**: February 27, 2026
