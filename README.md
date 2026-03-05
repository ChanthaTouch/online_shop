# 🍕 Touch Chantha Coffee - Food Delivery System

Complete documentation for the food delivery application with Laravel backend and Vue.js frontend.

---

## 📋 Table of Contents

1. [Quick Start (5 Minutes)](#-quick-start-5-minutes)
2. [System Overview](#-system-overview)
3. [Technology Stack](#-technology-stack)
4. [Prerequisites](#-prerequisites)
5. [Installation Guide](#-installation-guide)
6. [Configuration](#-configuration)
7. [Running the Application](#-running-the-application)
8. [Features](#-features)
9. [API Documentation](#-api-documentation)
10. [Architecture](#-architecture)
11. [Database Schema](#-database-schema)
12. [Deployment](#-deployment)
13. [Troubleshooting](#-troubleshooting)
14. [Development Guide](#-development-guide)

---

## ⚡ Quick Start (5 Minutes)

### Prerequisites Check
```bash
php -v        # Need 8.2+
composer -v   # PHP package manager
node -v       # Need 18+
npm -v        # Node package manager
```

### Setup Commands
```bash
# 1. Install backend dependencies
composer install

# 2. Setup environment
cp .env.example .env
php artisan key:generate

# 3. Create database
touch database/database.sqlite
php artisan migrate
php artisan storage:link

# 4. Setup frontend
cd frontend
npm install
npm run build
cd ..

# 5. Start server
php artisan serve
# Visit: http://localhost:8000
```

### Create Admin User
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin",
    "admin_key": "admin123"
  }'
```

**Login**: admin@example.com / password123

---

## 🎯 System Overview

A full-stack food delivery application for Touch Chantha Coffee featuring:

- **Customer Interface**: Browse products, manage cart, place orders, track deliveries
- **Admin Panel**: Manage products, categories, orders, discounts
- **Points System**: Earn 1 point per $1 spent
- **Discount Codes**: Percentage or fixed amount discounts
- **SMS Notifications**: Order confirmations via Mocean API
- **Payment Integration**: ABA Pay support
- **Image Management**: Product and category images
- **Stock Management**: Real-time inventory tracking

---

## 🛠 Technology Stack

### Backend
- **Framework**: Laravel 12
- **PHP**: 8.2+
- **Authentication**: Laravel Sanctum (token-based)
- **Database**: SQLite (default) / MySQL / PostgreSQL
- **SMS**: Twilio SDK + Mocean API
- **Queue**: Database driver

### Frontend
- **Framework**: Vue 3 (Composition API)
- **Language**: TypeScript
- **Build Tool**: Vite 7
- **Styling**: Tailwind CSS 4
- **HTTP Client**: Axios
- **Routing**: Vue Router 4
- **State**: VueUse composables

### Infrastructure
- **Containerization**: Docker
- **Deployment**: Railway / Traditional servers
- **Web Server**: Nginx / Apache (production)

---

## ✅ Prerequisites

1. **PHP 8.2 or higher**
2. **Composer** (PHP dependency manager)
3. **Node.js 18+** and npm
4. **Git**
5. **SQLite** (or MySQL/PostgreSQL)

---

## 📦 Installation Guide

### Step 1: Clone Repository
```bash
git clone <your-repository-url>
cd Mart-System
```

### Step 2: Backend Setup

#### Install Dependencies
```bash
composer install
```

#### Environment Configuration
```bash
cp .env.example .env
```

Edit `.env`:
```env
APP_NAME="Touch Chantha Coffee"
APP_ENV=local
APP_DEBUG=true
APP_URL=http://localhost:8000

DB_CONNECTION=sqlite

# Optional: SMS notifications
MOCEAN_API_TOKEN=your_token_here
MOCEAN_FROM=ChanthaCoffee

# Admin registration key
ADMIN_REGISTRATION_KEY=admin123
```

#### Generate Application Key
```bash
php artisan key:generate
```

#### Database Setup
```bash
# Create SQLite database
touch database/database.sqlite

# Run migrations
php artisan migrate

# Create storage link
php artisan storage:link
```

### Step 3: Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.local.example .env.local
```

Edit `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

#### Build Frontend
```bash
npm run build
cd ..
```

### Step 4: Create Admin User

**Option A: Using API**
```bash
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin",
    "email": "admin@example.com",
    "password": "password123",
    "role": "admin",
    "admin_key": "admin123"
  }'
```

**Option B: Using Tinker**
```bash
php artisan tinker
```
```php
\App\Models\User::create([
    'name' => 'Admin',
    'email' => 'admin@example.com',
    'password' => bcrypt('password123'),
    'role' => 'admin'
]);
```

---

## ⚙️ Configuration

### CORS Configuration
File: `config/cors.php`
```php
'paths' => ['api/*', 'sanctum/csrf-cookie', 'storage/*'],
'allowed_origins' => ['*'], // Update for production
'supports_credentials' => true,
```

### Session Configuration
File: `config/session.php`
```php
'driver' => env('SESSION_DRIVER', 'database'),
'domain' => env('SESSION_DOMAIN'),
'same_site' => 'lax',
```

### Sanctum Configuration
File: `config/sanctum.php`
```php
'stateful' => explode(',', env('SANCTUM_STATEFUL_DOMAINS', 'localhost,127.0.0.1')),
```

### File Upload Limits
Update `php.ini`:
```ini
upload_max_filesize = 10M
post_max_size = 10M
```

---

## 🚀 Running the Application

### Development Mode

#### Option 1: Separate Terminals

**Terminal 1 - Backend:**
```bash
php artisan serve
# Runs on http://localhost:8000
```

**Terminal 2 - Frontend Dev Server (optional):**
```bash
cd frontend
npm run dev
# Runs on http://localhost:5173
```

**Terminal 3 - Queue Worker:**
```bash
php artisan queue:work
```

#### Option 2: All-in-One
```bash
composer dev
```
Runs server, queue, logs, and vite concurrently.

### Production Mode

```bash
# Build frontend
cd frontend
npm run build
cd ..

# Optimize Laravel
php artisan config:cache
php artisan route:cache
php artisan view:cache

# Start server
php artisan serve --host=0.0.0.0 --port=8000

# Start queue worker
php artisan queue:work --daemon
```

### Access Points

- **Customer Site**: http://localhost:8000
- **Admin Panel**: http://localhost:8000/admin
- **API Base**: http://localhost:8000/api

---

## 🎁 Features

### 1. User Authentication
- Customer and admin registration
- Token-based authentication (Sanctum)
- Role-based access control
- Secure password hashing

### 2. Product Catalog
- Categories with images
- Products with multiple images
- Automatic discount calculation
- Time-based discounts
- Stock management
- Sugar level options (for beverages)
- Product variants (size, etc.)

### 3. Shopping Cart
- Add/update/remove items
- Persistent cart (database-backed)
- Real-time total calculation
- Sugar level selection
- Product attributes

### 4. Order Management
- Checkout with shipping address
- Discount code application
- Order status tracking:
  - `processing`: Order confirmed
  - `shipped`: Out for delivery
  - `delivered`: Completed
  - `cancelled`: Cancelled
- Order history
- SMS notifications

### 5. Discount System
- Percentage or fixed amount
- Minimum order requirements
- Usage limits
- Time-based validity
- Unique discount codes

### 6. Points/Rewards System
- Earn 1 point per $1 spent
- Points history tracking
- Lifetime earnings statistics
- Points redemption (future)

### 7. Admin Panel
- Product CRUD operations
- Category CRUD operations
- Discount CRUD operations
- Order management
- Order status updates
- Image upload

### 8. SMS Notifications
- Order confirmation
- Delivery updates
- Mocean API integration
- Phone number normalization

---

## 📡 API Documentation

### Base URL
```
http://localhost:8000/api
```

### Authentication
Include token in header:
```
Authorization: Bearer {token}
```

### Public Endpoints

#### Authentication
```bash
# Register
POST /api/register
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "0966463091",
  "role": "customer"
}

# Login
POST /api/login
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Catalog
```bash
# List categories
GET /api/categories

# Get category
GET /api/categories/{id}

# List products
GET /api/products?category_id=1&on_sale=true

# Get product
GET /api/products/{slug}
```

#### Discounts
```bash
# Apply discount
POST /api/discounts/apply
{
  "code": "SAVE10",
  "order_amount": 50.00
}
```

### Protected Endpoints (Require Authentication)

#### User
```bash
# Get current user
GET /api/me

# Logout
POST /api/logout
```

#### Cart
```bash
# Get cart
GET /api/cart

# Add item
POST /api/cart/items
{
  "product_id": 1,
  "quantity": 2,
  "sugar_level": "50%"
}

# Update item
PUT /api/cart/items/{id}
{
  "quantity": 3
}

# Remove item
DELETE /api/cart/items/{id}

# Clear cart
POST /api/cart/clear
```

#### Orders
```bash
# Checkout
POST /api/orders/checkout
{
  "shipping_address": {
    "name": "John Doe",
    "phone": "0966463091",
    "street": "123 Main St",
    "city": "Phnom Penh",
    "province": "Phnom Penh",
    "zip": "12000"
  },
  "payment_method": "aba_pay",
  "discount_code": "SAVE10"
}

# List orders
GET /api/orders

# Get order
GET /api/orders/{id}

# Cancel order
POST /api/orders/{id}/cancel
```

#### Points
```bash
# Get balance
GET /api/points

# Get history
GET /api/points/history

# Get statistics
GET /api/points/stats

# Redeem points
POST /api/points/redeem
{
  "points": 50
}
```

### Admin Endpoints (Require admin role)

#### Catalog Management
```bash
# Create category
POST /api/categories
FormData: name, slug, description, image

# Update category
PUT /api/categories/{id}

# Delete category
DELETE /api/categories/{id}

# Create product
POST /api/products
FormData: category_id, name, slug, price, stock, images[]

# Update product
PUT /api/products/{id}

# Delete product
DELETE /api/products/{id}

# Manage discounts
GET    /api/discounts
POST   /api/discounts
PUT    /api/discounts/{id}
DELETE /api/discounts/{id}
```

#### Order Management
```bash
# List all orders
GET /api/admin/orders?status=processing

# Get order details
GET /api/admin/orders/{id}

# Update order status
POST /api/admin/orders/{id}/status
{
  "status": "shipped"
}

# Cancel order
POST /api/admin/orders/{id}/cancel
```

### Response Formats

#### Success Response
```json
{
  "data": {...},
  "message": "Success"
}
```

#### Error Response
```json
{
  "message": "Error message",
  "errors": {
    "field": ["Validation error"]
  }
}
```

#### HTTP Status Codes
- `200`: Success
- `201`: Created
- `400`: Bad Request
- `401`: Unauthorized
- `403`: Forbidden
- `404`: Not Found
- `422`: Validation Error
- `500`: Server Error

---

## 🏗 Architecture

### System Architecture

```
┌─────────────────────────────────────────┐
│         Vue 3 Frontend (TypeScript)      │
│  Customer Interface + Admin Panel        │
└─────────────────────────────────────────┘
                    ↕ HTTP/REST
┌─────────────────────────────────────────┐
│      Laravel 12 Backend (PHP 8.2+)      │
│  - RESTful API                           │
│  - Sanctum Authentication                │
│  - CORS Middleware                       │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│         Application Layer                │
│  Controllers → Services → Models         │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│      SQLite/MySQL Database               │
│      File Storage (Images)               │
│      Queue Jobs (Database)               │
└─────────────────────────────────────────┘
                    ↕
┌─────────────────────────────────────────┐
│       External Services                  │
│  - Mocean API (SMS)                      │
│  - ABA Pay (Payment)                     │
└─────────────────────────────────────────┘
```

### Project Structure

```
Mart-System/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CartController.php
│   │   │   ├── OrderController.php
│   │   │   ├── DiscountController.php
│   │   │   ├── PointsController.php
│   │   │   └── Admin/
│   │   │       └── OrderAdminController.php
│   │   └── Middleware/
│   │       └── AdminMiddleware.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Product.php
│   │   ├── Category.php
│   │   ├── Cart.php
│   │   ├── Order.php
│   │   ├── Discount.php
│   │   └── CustomerPoints.php
│   ├── Services/
│   │   ├── MoceanService.php
│   │   └── RefundService.php
│   └── Notifications/
│       ├── OrderStatusChanged.php
│       └── OrderRefunded.php
├── frontend/
│   └── src/
│       ├── views/
│       │   ├── Home.vue
│       │   ├── Products.vue
│       │   ├── Cart.vue
│       │   ├── Checkout.vue
│       │   ├── Orders.vue
│       │   └── Admin/
│       │       ├── ProductManagement.vue
│       │       ├── CategoryManagement.vue
│       │       └── DiscountCreate.vue
│       ├── components/
│       │   ├── layout/
│       │   │   ├── DefaultLayout.vue
│       │   │   └── AdminLayout.vue
│       │   ├── ProductCard.vue
│       │   └── PointsBadge.vue
│       ├── router/
│       │   └── index.ts
│       ├── services/
│       │   └── api.ts
│       └── utils/
│           └── image.ts
├── database/
│   ├── migrations/
│   └── database.sqlite
├── routes/
│   ├── api.php
│   └── web.php
├── public/
│   └── storage/
└── storage/
    ├── app/public/
    └── logs/
```

### Authentication Flow

```
1. User Login
   ↓
2. Backend validates credentials
   ↓
3. Generate Sanctum token
   ↓
4. Return token to frontend
   ↓
5. Frontend stores in localStorage
   ↓
6. Include token in Authorization header
   ↓
7. Backend validates token on each request
```

### Order Creation Flow

```
1. User adds items to cart
   ↓
2. User proceeds to checkout
   ↓
3. Enter shipping address
   ↓
4. Apply discount code (optional)
   ↓
5. Calculate totals
   ↓
6. Create order (DB transaction)
   ├── Create order record
   ├── Create order items
   ├── Decrement product stock
   ├── Increment discount usage
   └── Clear cart
   ↓
7. Award points to customer
   ↓
8. Send SMS confirmation
   ↓
9. Return order details
```

---

## 💾 Database Schema

### Entity Relationship Diagram

```
users (id, name, email, password, role)
  ↓ 1:1
carts (id, user_id)
  ↓ 1:N
cart_items (id, cart_id, product_id, quantity, sugar_level)
  ↓ N:1
products (id, category_id, name, slug, price, stock, images)
  ↓ N:1
categories (id, name, slug, image)

users (id)
  ↓ 1:N
orders (id, user_id, order_number, status, total, shipping_address)
  ↓ 1:N
order_items (id, order_id, product_id, quantity, unit_price)

users (id)
  ↓ 1:1
customer_points (id, user_id, total_points, lifetime_earned)
  ↓ 1:N
points_transactions (id, user_id, type, points, order_id)

discounts (id, code, type, value, min_order_amount, max_uses)
  ↓ N:N
products (via discount_product pivot table)
```

### Key Tables

#### users
- `id`: Primary key
- `name`: User's full name
- `email`: Unique email
- `password`: Hashed password
- `role`: 'customer' or 'admin'

#### products
- `id`: Primary key
- `category_id`: Foreign key to categories
- `name`: Product name
- `slug`: URL-friendly identifier
- `description`: Product description
- `price`: Base price
- `stock`: Available quantity
- `discount_price`: Calculated discount price
- `discount_percentage`: Discount percentage
- `discount_starts_at`: Discount start date
- `discount_ends_at`: Discount end date
- `sugar_level`: Boolean for sugar level option
- `images`: JSON array of image paths
- `variants`: JSON array of variants
- `is_active`: Boolean

#### orders
- `id`: Primary key
- `user_id`: Foreign key to users
- `order_number`: Unique order identifier
- `status`: 'processing', 'shipped', 'delivered', 'cancelled'
- `subtotal`: Items total
- `discount`: Discount amount
- `shipping_fee`: Shipping cost
- `total`: Final total
- `payment_method`: Payment method used
- `payment_ref`: Payment reference
- `shipping_address`: JSON object

#### discounts
- `id`: Primary key
- `code`: Unique discount code
- `type`: 'percentage' or 'fixed'
- `value`: Discount value
- `min_order_amount`: Minimum order requirement
- `max_uses`: Maximum usage limit
- `current_uses`: Current usage count
- `starts_at`: Start date/time
- `expires_at`: End date/time

#### customer_points
- `id`: Primary key
- `user_id`: Foreign key to users
- `total_points`: Current balance
- `lifetime_earned`: Total points earned
- `lifetime_redeemed`: Total points redeemed

---

## 🌐 Deployment

### Railway Deployment

1. **Connect Repository**
   - Link GitHub repository to Railway
   - Railway auto-detects Laravel

2. **Environment Variables**
```env
APP_ENV=production
APP_DEBUG=false
APP_KEY=base64:your_generated_key
APP_URL=https://your-app.railway.app

DB_CONNECTION=mysql
DATABASE_URL=mysql://user:pass@host:port/dbname

MOCEAN_API_TOKEN=your_token
MOCEAN_FROM=ChanthaCoffee

ADMIN_REGISTRATION_KEY=your_secret_key
```

3. **Deploy**
   - Railway automatically builds and deploys
   - Uses `Dockerfile` and `start.sh`

### Docker Deployment

```bash
# Build image
docker build -t food-delivery .

# Run container
docker run -p 8000:8000 \
  -e APP_KEY=your_key \
  -e DB_CONNECTION=sqlite \
  food-delivery
```

### Traditional Server (Nginx)

1. **Install Dependencies**
```bash
sudo apt update
sudo apt install php8.2 php8.2-fpm nginx composer nodejs npm
```

2. **Clone & Setup**
```bash
cd /var/www
git clone <repo-url> food-delivery
cd food-delivery
composer install --optimize-autoloader --no-dev
cd frontend && npm install && npm run build && cd ..
```

3. **Configure Nginx**
```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /var/www/food-delivery/public;

    add_header X-Frame-Options "SAMEORIGIN";
    add_header X-Content-Type-Options "nosniff";

    index index.php;

    charset utf-8;

    location / {
        try_files $uri $uri/ /index.php?$query_string;
    }

    location = /favicon.ico { access_log off; log_not_found off; }
    location = /robots.txt  { access_log off; log_not_found off; }

    error_page 404 /index.php;

    location ~ \.php$ {
        fastcgi_pass unix:/var/run/php/php8.2-fpm.sock;
        fastcgi_param SCRIPT_FILENAME $realpath_root$fastcgi_script_name;
        include fastcgi_params;
    }

    location ~ /\.(?!well-known).* {
        deny all;
    }
}
```

4. **Set Permissions**
```bash
sudo chown -R www-data:www-data /var/www/food-delivery
sudo chmod -R 755 /var/www/food-delivery
sudo chmod -R 775 /var/www/food-delivery/storage
sudo chmod -R 775 /var/www/food-delivery/bootstrap/cache
```

5. **Setup Queue Worker**
```bash
sudo nano /etc/supervisor/conf.d/laravel-worker.conf
```
```ini
[program:laravel-worker]
process_name=%(program_name)s_%(process_num)02d
command=php /var/www/food-delivery/artisan queue:work --sleep=3 --tries=3
autostart=true
autorestart=true
user=www-data
numprocs=1
redirect_stderr=true
stdout_logfile=/var/www/food-delivery/storage/logs/worker.log
```

6. **SSL Certificate (Let's Encrypt)**
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

---

## 🐛 Troubleshooting

### Common Issues

#### 1. Permission Denied Errors
```bash
chmod -R 775 storage bootstrap/cache
sudo chown -R $USER:www-data storage bootstrap/cache
```

#### 2. Storage Link Not Found
```bash
rm public/storage
php artisan storage:link
```

#### 3. Frontend Can't Connect to Backend
Check `frontend/.env.local`:
```env
VITE_API_URL=http://localhost:8000/api
```

Clear browser cache and localStorage:
```javascript
// In browser console
localStorage.clear()
location.reload()
```

#### 4. 401 Unauthorized Errors
- Clear localStorage and login again
- Check token is being sent in Authorization header
- Verify Sanctum configuration in `config/sanctum.php`
- Check CORS settings in `config/cors.php`

#### 5. Images Not Displaying
```bash
# Recreate storage link
php artisan storage:link

# Check permissions
chmod -R 775 storage/app/public

# Verify image paths in database
php artisan tinker
>>> \App\Models\Product::first()->images
```

#### 6. Database Connection Error
```bash
# For SQLite
touch database/database.sqlite
php artisan migrate

# For MySQL
# Update .env with correct credentials
php artisan config:clear
php artisan migrate
```

#### 7. Frontend Build Errors
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### 8. CORS Errors
Update `config/cors.php`:
```php
'allowed_origins' => [
    'http://localhost:5173',
    'http://localhost:8000',
    env('FRONTEND_URL', '*')
],
'supports_credentials' => true,
```

#### 9. SMS Not Sending
- Verify `MOCEAN_API_TOKEN` in `.env`
- Check phone number format (must include country code)
- Review logs: `tail -f storage/logs/laravel.log`
- Test API credentials with Mocean dashboard

#### 10. Queue Jobs Not Processing
```bash
# Check queue connection
php artisan queue:work --once

# View failed jobs
php artisan queue:failed

# Retry failed jobs
php artisan queue:retry all

# Clear queue
php artisan queue:flush
```

### Debug Mode

Enable detailed error messages:
```env
APP_DEBUG=true
LOG_LEVEL=debug
```

View logs:
```bash
# Real-time logs
php artisan pail

# Or tail the log file
tail -f storage/logs/laravel.log
```

### Database Issues

Reset database:
```bash
php artisan migrate:fresh
```

Seed test data:
```bash
php artisan db:seed
```

### Cache Issues

Clear all caches:
```bash
php artisan cache:clear
php artisan config:clear
php artisan route:clear
php artisan view:clear
composer dump-autoload
```

---

## 💻 Development Guide

### Adding a New Feature

1. **Create Migration**
```bash
php artisan make:migration create_feature_table
php artisan migrate
```

2. **Create Model**
```bash
php artisan make:model Feature
```

3. **Create Controller**
```bash
php artisan make:controller FeatureController
```

4. **Add Routes**
Edit `routes/api.php`:
```php
Route::get('/features', [FeatureController::class, 'index']);
```

5. **Create Frontend View**
Create `frontend/src/views/Feature.vue`

6. **Add Frontend Route**
Edit `frontend/src/router/index.ts`:
```typescript
{ path: '/features', name: 'Features', component: () => import('@/views/Feature.vue') }
```

### Code Quality

```bash
# Format code
./vendor/bin/pint

# Run tests
php artisan test

# Run specific test
php artisan test --filter=OrderTest
```

### Common Commands

```bash
# Backend
php artisan serve              # Start server
php artisan migrate            # Run migrations
php artisan migrate:rollback   # Rollback migrations
php artisan tinker             # REPL
php artisan route:list         # List routes
php artisan queue:work         # Process queue
php artisan storage:link       # Create storage link

# Frontend
cd frontend
npm run dev                    # Dev server with hot reload
npm run build                  # Production build
npm run preview                # Preview production build

# Database
php artisan migrate:fresh      # Reset database
php artisan db:seed            # Seed data
sqlite3 database/database.sqlite  # SQLite CLI

# Cache
php artisan cache:clear        # Clear cache
php artisan config:cache       # Cache config
php artisan route:cache        # Cache routes
php artisan view:cache         # Cache views
```

### Testing API with cURL

```bash
# Register
curl -X POST http://localhost:8000/api/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","email":"test@test.com","password":"password123"}'

# Login
curl -X POST http://localhost:8000/api/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@test.com","password":"password123"}'

# Get products (public)
curl http://localhost:8000/api/products

# Get cart (authenticated)
curl http://localhost:8000/api/cart \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Environment Variables Reference

```env
# Application
APP_NAME="Touch Chantha Coffee"
APP_ENV=local|production
APP_DEBUG=true|false
APP_URL=http://localhost:8000

# Database
DB_CONNECTION=sqlite|mysql|pgsql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=database_name
DB_USERNAME=username
DB_PASSWORD=password

# SMS (Mocean)
MOCEAN_API_TOKEN=your_api_token
MOCEAN_FROM=ChanthaCoffee

# Admin
ADMIN_REGISTRATION_KEY=your_secret_key

# Session
SESSION_DRIVER=database
SESSION_DOMAIN=null

# Queue
QUEUE_CONNECTION=database

# Mail (optional)
MAIL_MAILER=smtp
MAIL_HOST=smtp.mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
```

---

## 📚 Additional Resources

### Documentation
- [Laravel Documentation](https://laravel.com/docs)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Laravel Sanctum](https://laravel.com/docs/sanctum)
- [Vite](https://vitejs.dev/)

### Tools
- [Postman](https://www.postman.com/) - API testing
- [TablePlus](https://tableplus.com/) - Database GUI
- [Vue DevTools](https://devtools.vuejs.org/) - Vue debugging
- [Laravel Debugbar](https://github.com/barryvdh/laravel-debugbar) - Laravel debugging

### Community
- [Laravel Forums](https://laracasts.com/discuss)
- [Vue Forum](https://forum.vuejs.org/)
- [Stack Overflow](https://stackoverflow.com/)

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Coding Standards
- Follow PSR-12 for PHP code
- Use TypeScript for frontend
- Write meaningful commit messages
- Add tests for new features
- Update documentation

---

## 📝 License

This project is licensed under the MIT License.

---

## 👥 Team

**Touch Chantha Coffee Development Team**

---

## 📞 Support

For issues or questions:
1. Check this documentation
2. Review logs: `storage/logs/laravel.log`
3. Check browser console for frontend errors
4. Review network tab for API details

---

## 🎯 Roadmap

### Planned Features
- [ ] Multiple payment methods
- [ ] Real-time order tracking
- [ ] Customer reviews and ratings
- [ ] Loyalty program enhancements
- [ ] Mobile app (React Native)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Inventory management
- [ ] Delivery driver app
- [ ] Push notifications

---

## 📊 Project Status

**Version**: 1.0.0  
**Status**: Production Ready  
**Last Updated**: March 2026

### Current Features
✅ User authentication (customer/admin)  
✅ Product catalog with categories  
✅ Shopping cart  
✅ Order management  
✅ Discount codes  
✅ Points/rewards system  
✅ Admin panel  
✅ SMS notifications  
✅ Image upload  
✅ Stock management  

---

**Built with ❤️ for Touch Chantha Coffee**

For more information, visit our website or contact support.
