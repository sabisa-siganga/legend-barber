FROM php:8.4-fpm-alpine

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

RUN apk add --no-cache \
        gettext \
        libpq \
        libzip \
        nginx \
        unzip \
    && apk add --no-cache --virtual .build-deps \
        libzip-dev \
        postgresql-dev \
    && docker-php-ext-install opcache pdo_pgsql zip \
    && apk del .build-deps \
    && rm -f /etc/nginx/http.d/default.conf \
    && printf '%s\n' \
        'opcache.enable=1' \
        'opcache.enable_cli=1' \
        'opcache.validate_timestamps=0' \
        > /usr/local/etc/php/conf.d/opcache.ini

WORKDIR /var/www/html

COPY . .

RUN composer install \
        --no-dev \
        --no-interaction \
        --prefer-dist \
        --optimize-autoloader \
        --no-scripts \
    && php artisan package:discover --ansi \
    && mkdir -p \
        bootstrap/cache \
        storage/framework/cache/data \
        storage/framework/sessions \
        storage/framework/views \
        storage/logs \
    && chown -R www-data:www-data storage bootstrap/cache

EXPOSE 10000

CMD ["sh", "docker/start.sh"]
