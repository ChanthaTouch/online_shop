FROM php:8.2-cli

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git unzip curl libzip-dev zip

# Install PHP extensions
RUN docker-php-ext-install pdo pdo_mysql zip

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

WORKDIR /app

# Copy all files from current context (/store-backend) to /app in container
COPY . /app

RUN composer install --no-dev --optimize-autoloader

EXPOSE 8080

# Run migrations (force in prod) then start PHP server
# Use $PORT for Railway compatibility (falls back to 8080)
CMD php artisan migrate --force && php -S 0.0.0.0:${PORT:-8080} -t public