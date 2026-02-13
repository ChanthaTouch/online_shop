# SMS Integration Guide - MoceanAPI

## Overview
Your e-commerce system now automatically sends SMS notifications to customers when they place an order using **MoceanAPI**.

## Setup Instructions

### 1. Environment Variables (.env)
Add these variables to your `.store-backend/.env` file:

```env
# MoceanAPI Configuration
MOCEAN_API_TOKEN=your_mocean_api_token_here
MOCEAN_FROM=TouchChantha
```

**Where to get these:**
- **MOCEAN_API_TOKEN**: Get from your MoceanAPI account (https://moceanapi.com)
- **MOCEAN_FROM**: This is your sender ID (can be your business name, max 15 characters)

### 2. How It Works

#### Automatic SMS on Order Placement
When a customer completes checkout:

1. Customer enters their **phone number** in the Checkout form
2. Order is created in the database
3. **SMS is automatically sent** to the customer's phone number with:
   - Order confirmation number
   - Order total price
   - Expected shipping information
   - Business name and logo

**SMS Template:**
```
Hello [Customer Name],

Thank you for your order #ORD-XXXXX!
Total: $XX.XX

We received your payment and will prepare and ship your order soon.
Please wait for our confirmation call.

Enjoy your drink! ☕
- Touch Chantha Coffee
```

### 3. Phone Number Format Support
The system automatically normalizes phone numbers:
- ✅ `0966463091` → `855966463091`
- ✅ `966463091` → `855966463091`
- ✅ `+855966463091` → `855966463091`
- ✅ `855 966 463 091` → `855966463091`

### 4. Testing the SMS Service

#### Test Endpoint (Admin Only)
```bash
curl -X GET http://localhost:8000/api/sms/test \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json"
```

Response:
```json
{
  "success": true,
  "message": "SMS service is properly configured",
  "mocean_from": "TouchChantha"
}
```

#### Manual SMS Sending Endpoint
```bash
curl -X POST http://localhost:8000/api/sms/send \
  -H "Authorization: Bearer YOUR_SANCTUM_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "0966463091",
    "message": "Hello! This is a test message from Touch Chantha."
  }'
```

### 5. Backend Implementation

#### OrderController (Automatic SMS)
Located in: `store-backend/app/Http/Controllers/OrderController.php`

Lines 140-173: Automatic SMS sending after order creation
- ✅ Validates phone number format
- ✅ Normalizes Cambodian phone numbers
- ✅ Uses MoceanAPI to send SMS
- ✅ Logs SMS sending results
- ✅ Won't fail order creation if SMS fails

#### SmsController (Manual SMS)
Located in: `store-backend/app/Http/Controllers/SmsController.php`

Methods:
- `send()` - Send custom SMS to a phone number (Admin only)
- `test()` - Test if SMS service is configured

### 6. Frontend (Automatic)
The frontend **does NOT need any changes**. SMS is sent automatically by the backend when:
- Customer completes checkout
- Order is successfully created
- Phone number is provided in shipping information

The checkout flow remains the same:
1. Fill shipping information (including phone)
2. Click "Place Order & Show QR"
3. Backend automatically sends SMS to the phone number
4. QR code is displayed for payment

### 7. Troubleshooting

#### SMS Not Being Sent?
Check these:
1. **Environment Variables**: Verify `MOCEAN_API_TOKEN` and `MOCEAN_FROM` are set in `.env`
2. **Phone Format**: Ensure phone number starts with `0`, `855`, or `+855` (system auto-normalizes)
3. **API Credentials**: Verify token is valid at https://moceanapi.com
4. **Check Logs**: Look in `storage/logs/laravel.log` for errors

#### Check SMS Logs
```bash
cd store-backend
tail -f storage/logs/laravel.log | grep SMS
```

#### Test Configuration
```bash
cd store-backend
php artisan tinker
>>> $mocean = new \App\Services\MoceanService();
>>> $result = $mocean->sendSms('855966463091', 'Test message');
>>> dd($result);
```

### 8. API Routes

| Method | Endpoint | Auth | Purpose |
|--------|----------|------|---------|
| POST | `/api/orders/checkout` | ✅ Required | Place order (triggers auto SMS) |
| POST | `/api/sms/send` | ✅ Admin | Send custom SMS (testing) |
| GET | `/api/sms/test` | ✅ Admin | Test SMS configuration |

### 9. Security Notes
- ✅ SMS endpoints require authentication
- ✅ Manual SMS sending is admin-only
- ✅ Customer phone numbers are stored securely in orders
- ✅ Failed SMS does not block order creation

### 10. Cost Considerations
MoceanAPI charges per SMS sent. Monitor your usage:
- Check your MoceanAPI dashboard regularly
- Consider SMS costs in your product pricing
- Sample rate: ~$0.01-0.05 per SMS (check MoceanAPI pricing)

---

## Summary
✅ SMS automatically sends when customer places order
✅ Customer receives order confirmation via SMS
✅ Phone numbers are automatically normalized
✅ No frontend changes needed
✅ Admin can manually send SMS for testing
