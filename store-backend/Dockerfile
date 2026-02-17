FROM php:8.2-apache-alpine

RUN apk add --no-cache \
    git unzip curl zip libzip-dev oniguruma-dev \
    libpng-dev libjpeg-turbo-dev freetype-dev \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install pdo_mysql zip gd mbstring exif pcntl bcmath

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY . .

RUN chown -R www-data:www-data . \
    && chmod -R 775 storage bootstrap/cache

RUN composer install --no-dev --optimize-autoloader --no-interaction --prefer-dist

RUN a2enmod rewrite

ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' /etc/apache2/sites-available/*.conf

EXPOSE 80

CMD ["apache2-foreground"]
