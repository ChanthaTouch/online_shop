FROM php:8.2-apache-alpine

# Install system dependencies and PHP extensions
RUN apk add --no-cache \
    git unzip curl zip libzip-dev oniguruma-dev \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd mbstring exif pcntl bcmath

# Install Composer
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /var/www/html

# Copy application code
COPY . .

# Fix permissions (very important for Laravel)
RUN chown -R www-data:www-data . \
    && chmod -R 775 storage bootstrap/cache

# Install Composer dependencies (production mode)
RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

# Create storage symlink
RUN php artisan storage:link 2>/dev/null || true

# Enable important Apache modules
RUN a2enmod rewrite headers

# Set Laravel public directory as document root
ENV APACHE_DOCUMENT_ROOT /var/www/html/public

# Update Apache configuration - document root
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf \
    && sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/apache2.conf /etc/apache2/conf-available/*.conf

# ───────────────────────────────────────────────
# Railway-specific fixes
# ───────────────────────────────────────────────

# Support Railway PORT variable (they set it automatically)
ARG PORT=80
ENV PORT=${PORT}

# Make Apache listen on all interfaces and the correct port
RUN echo "Listen 0.0.0.0:${PORT}" > /etc/apache2/ports.conf \
    && sed -i "s/<VirtualHost \*:80>/<VirtualHost *:80>\n    ServerName localhost/g" /etc/apache2/sites-available/000-default.conf \
    && sed -i "s/AllowOverride None/AllowOverride All/g" /etc/apache2/sites-available/000-default.conf

# Add proper <Directory> block for Laravel
RUN echo "<Directory ${APACHE_DOCUMENT_ROOT}>\n\
    Options Indexes FollowSymLinks\n\
    AllowOverride All\n\
    Require all granted\n\
</Directory>" >> /etc/apache2/apache2.conf

# Suppress server name warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Expose the port (important for Railway)
EXPOSE ${PORT}

# Start Apache in foreground mode
CMD ["apache2-foreground"]