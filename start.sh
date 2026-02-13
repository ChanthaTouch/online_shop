composer install --optimize-autoloader --no-dev

php artisan migrate --force
php artisan optimize