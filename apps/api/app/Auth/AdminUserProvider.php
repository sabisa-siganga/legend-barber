<?php

namespace App\Auth;

use Illuminate\Contracts\Auth\Authenticatable;
use Illuminate\Contracts\Auth\UserProvider;

class AdminUserProvider implements UserProvider
{
    public function retrieveById($identifier): ?Authenticatable
    {
        if ($identifier !== 'admin') {
            return null;
        }

        return new AdminUser;
    }

    public function retrieveByToken($identifier, $token): ?Authenticatable
    {
        return null;
    }

    public function updateRememberToken(Authenticatable $user, $token): void {}

    public function retrieveByCredentials(array $credentials): ?Authenticatable
    {
        if (($credentials['username'] ?? null) !== 'admin') {
            return null;
        }

        return new AdminUser;
    }

    public function validateCredentials(Authenticatable $user, array $credentials): bool
    {
        $configured = (string) config('legend.admin_password');
        $given = (string) ($credentials['password'] ?? '');

        if ($configured === '' || $given === '') {
            return false;
        }

        return hash_equals($configured, $given);
    }

    public function rehashPasswordIfRequired(Authenticatable $user, array $credentials, bool $force = false): void {}
}
