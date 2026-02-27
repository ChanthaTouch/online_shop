# Deploy Authentication Fix - Quick Guide

## What Was Fixed
- ✅ Backend routes now use real Sanctum authentication (not mock tokens)
- ✅ Frontend detects and clears mock tokens automatically
- ✅ Better error handling for 401 responses

## Files Changed
1. `routes/api.php` - Changed to use real `AuthController`
2. `frontend/src/services/api.ts` - Added mock token detection

## Deployment Steps

### 1. Backend (Railway)
```bash
# Commit backend changes
git add routes/api.php
git commit -m "Fix: Use real Sanctum authentication"
git push

# Railway will auto-deploy
# Wait 2-3 minutes for deployment
```

### 2. Frontend (Railway or Vercel)
```bash
# Commit frontend changes
git add frontend/src/services/api.ts
git commit -m "Fix: Detect and clear mock tokens"
git push

# If using Railway: auto-deploys
# If using Vercel: auto-deploys
# Wait 2-3 minutes for deployment
```

### 3. Test After Deployment

**A. Clear Browser Data**
```javascript
// Open browser console (F12)
localStorage.clear()
// Refresh page
```

**B. Register New User**
1. Go to `/register`
2. Fill in details
3. Submit
4. Check console - should see real token (starts with `1|`)

**C. Test Cart**
1. Browse products
2. Click "Add to Cart"
3. Should work without 401 errors
4. Check cart page - should show items

**D. Test Profile**
1. Go to `/profile`
2. Should load without errors
3. Should show user info

## User Impact

### Existing Users
- **Must re-login** to get valid tokens
- Old mock tokens will be automatically cleared
- No data loss - just need to login again

### New Users
- Will get real tokens immediately
- Everything works out of the box

## Verification Checklist

After deployment, verify:

- [ ] Backend deployed successfully on Railway
- [ ] Frontend deployed successfully
- [ ] Can register new user
- [ ] Can login with credentials
- [ ] Token format is `1|...` (not `mock-token`)
- [ ] Can add items to cart (no 401 errors)
- [ ] Can view cart
- [ ] Can view profile
- [ ] Can checkout

## Rollback Plan

If something goes wrong:

```bash
# Revert backend
git revert HEAD
git push

# Revert frontend
cd frontend
git revert HEAD
git push
```

## Monitoring

### Check Backend Logs
```bash
# On Railway
railway logs --tail

# Look for:
# ✅ "User logged in" messages
# ✅ "Token created" messages
# ❌ "Unauthenticated" errors (should be gone)
```

### Check Frontend Console
```javascript
// Should see:
// ✅ Token stored: 1|abc123...
// ❌ No "401 Unauthorized" errors
```

## Common Issues After Deploy

### Issue 1: Still Getting 401
**Solution**: Clear browser cache and localStorage
```javascript
localStorage.clear()
location.reload()
```

### Issue 2: Can't Login
**Check**: Backend logs for authentication errors
```bash
railway logs --tail
```

### Issue 3: Token Not Saved
**Check**: Browser console for errors
**Solution**: Check if localStorage is enabled

### Issue 4: CORS Errors
**Check**: `config/cors.php` allows your frontend domain
**Solution**: Add frontend domain to allowed origins

## Success Indicators

You'll know it's working when:
1. ✅ Login returns token starting with `1|`
2. ✅ Cart operations work (200 responses)
3. ✅ Profile loads successfully
4. ✅ No 401 errors in console
5. ✅ Users can complete checkout

## Timeline

- **Backend Deploy**: ~2-3 minutes
- **Frontend Deploy**: ~2-3 minutes
- **Total Downtime**: None (rolling deployment)
- **User Impact**: Must re-login once

## Communication Template

**For Users:**
```
🔧 System Update

We've improved our authentication system for better security.

Action Required:
- Please logout and login again
- Your data is safe - just need fresh credentials

This is a one-time requirement.

Thank you for your patience!
```

## Post-Deployment

### Monitor for 24 Hours
- Check error rates
- Monitor login success rate
- Watch for 401 errors
- Check user feedback

### Metrics to Track
- Login success rate (should be >95%)
- Cart operations (should have no 401s)
- User complaints (should be minimal)

## Summary

**Before:**
- Mock tokens: `"mock-token"`
- 401 errors on cart/profile
- Authentication broken

**After:**
- Real Sanctum tokens: `"1|abc123..."`
- All authenticated endpoints work
- Secure token validation

**User Action:**
- Re-login once (automatic token cleanup)

---

**Status**: Ready to Deploy
**Risk Level**: Low (only affects authentication)
**Rollback Time**: <5 minutes
**Date**: February 27, 2026
