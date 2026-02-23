FROM php:8.2-apache-alpine

# Install required packages and PHP extensions
RUN apk add --no-cache \
    git unzip curl zip libzip-dev oniguruma-dev \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd mbstring exif pcntl bcmath

# Copy Composer from official image
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy project files
COPY . .

# Permissions for Laravel
RUN chown -R www-data:www-data . \
    && chmod -R 775 storage bootstrap/cache

# Install dependencies
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Create storage symlink
RUN php artisan storage:link 2>/dev/null || true

# Enable Laravel’s .htaccess by allowing overrides
RUN sed -i 's#AllowOverride None#AllowOverride All#' /etc/apache2/httpd.conf

# Set document root (Alpine default is /var/www/localhost/htdocs)
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e "s!/var/www/localhost/htdocs!${APACHE_DOCUMENT_ROOT}!g" /etc/apache2/httpd.conf

EXPOSE 80

CMD ["httpd", "-D", "FOREGROUND"]
