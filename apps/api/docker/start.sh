#!/bin/sh
set -e

if [ -f /etc/secrets/ca.pem ]; then
    cp /etc/secrets/ca.pem /tmp/aiven-ca.pem
    chmod 0644 /tmp/aiven-ca.pem
fi

php artisan config:cache
php artisan route:cache
php artisan migrate --force
php artisan db:seed --force

exec apache2-foreground
