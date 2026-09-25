#!/bin/sh
set -eu

cd /var/www/html

port="${PORT:-10000}"

mkdir -p \
    bootstrap/cache \
    storage/framework/cache/data \
    storage/framework/sessions \
    storage/framework/views \
    storage/logs \
    /run/nginx \
    /usr/local/var/run \
    /var/lib/nginx/tmp

chown -R www-data:www-data storage bootstrap/cache

export PORT="$port"
envsubst '${PORT}' < docker/nginx.conf > /etc/nginx/http.d/default.conf

php artisan package:discover --ansi
php artisan migrate --force
php artisan db:seed --force
php artisan config:cache
php artisan route:cache

php-fpm --nodaemonize &
fpm_pid=$!

nginx -g 'daemon off;' &
nginx_pid=$!

stopped=0

shutdown() {
    if [ "$stopped" -eq 1 ]; then
        return
    fi

    stopped=1
    kill "$nginx_pid" "$fpm_pid" 2>/dev/null || true
    wait "$nginx_pid" 2>/dev/null || true
    wait "$fpm_pid" 2>/dev/null || true
}

trap 'shutdown; exit 0' TERM INT

while kill -0 "$fpm_pid" 2>/dev/null && kill -0 "$nginx_pid" 2>/dev/null; do
    sleep 1
done

shutdown
exit 1
