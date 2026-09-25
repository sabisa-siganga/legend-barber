<?php

use Illuminate\Testing\TestResponse;

function legendBookingPayload(array $overrides = []): array
{
    return array_merge([
        'serviceId' => 'signature-cut',
        'date' => '2026-09-26',
        'startTime' => '10:30',
        'customerName' => 'Jane Doe',
        'email' => 'jane@example.com',
        'phone' => '+27 82 123 4567',
    ], $overrides);
}

function legendPrepareSpa(): void
{
    $test = test();
    $test->withCredentials();
    $test->withHeader('Origin', 'http://localhost:5173');
    $test->withHeader('Referer', 'http://localhost:5173');

    $csrf = $test->get('/sanctum/csrf-cookie');
    legendStoreCookies($csrf);

    $token = '';

    foreach ($csrf->headers->getCookies() as $cookie) {
        if ($cookie->getName() === 'XSRF-TOKEN') {
            $token = urldecode($cookie->getValue());
        }
    }

    $test->withHeader('X-XSRF-TOKEN', $token);
}

function legendStoreCookies(TestResponse $response): void
{
    foreach ($response->headers->getCookies() as $cookie) {
        test()->withUnencryptedCookie($cookie->getName(), $cookie->getValue());
    }
}

function legendAdminLogin(): void
{
    legendPrepareSpa();

    $response = test()->postJson('/api/admin/login', [
        'username' => 'admin',
        'password' => 'test-admin-password',
    ]);

    $response->assertOk();
    legendStoreCookies($response);
    app('auth')->forgetGuards();
}
