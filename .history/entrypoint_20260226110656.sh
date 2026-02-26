#!/usr/bin/env bash
set -euo pipefail

echo "→ Running Laravel startup tasks..."

# Create storage symlink (idempotent)
php artisan storage:link --force || true

# Optional: warm up caches (safe in production)
php artisan config:cache    || true
php artisan route:cache     || true
php artisan view:cache      || true
# php artisan event:cache   || true   # only if you use events heavily

# Fix permissions (important after build / volume mount)
chown -R www-data:www-data storage bootstrap/cache public
chmod -R 775 storage bootstrap/cache
find storage bootstrap/cache -type f -exec chmod 664 {} \;

echo "→ Startup complete. Starting Apache..."

# Start Apache in foreground
exec apache2-foreground