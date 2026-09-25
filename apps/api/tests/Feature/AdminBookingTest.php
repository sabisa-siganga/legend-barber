<?php

use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Route;

uses(RefreshDatabase::class);

beforeEach(function () {
    Carbon::setTestNow(Carbon::parse('2026-09-25 10:15:00', 'Africa/Johannesburg'));
    $this->seed(ServiceSeeder::class);
});

afterEach(function () {
    Carbon::setTestNow();
});

it('returns 401 for unauthenticated admin booking requests', function () {
    $this->getJson('/api/admin/bookings?date=2026-09-28')
        ->assertUnauthorized();
});

it('lets a valid admin login read bookings for the selected date', function () {
    $earlier = $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'line-up-edge-detail',
        'date' => '2026-09-28',
        'startTime' => '09:00',
        'customerName' => 'Earlier Guest',
        'email' => 'early@example.com',
        'phone' => '+27 82 000 0001',
    ]))->assertCreated();

    $later = $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'cut-beard-detail',
        'date' => '2026-09-28',
        'startTime' => '11:30',
        'customerName' => 'Later Guest',
        'email' => 'later@example.com',
        'phone' => '+27 82 000 0002',
    ]))->assertCreated();

    $this->postJson('/api/bookings', legendBookingPayload([
        'date' => '2026-09-29',
        'startTime' => '09:00',
        'customerName' => 'Other Day',
        'email' => 'other@example.com',
    ]))->assertCreated();

    legendAdminLogin();

    $this->getJson('/api/admin/session')
        ->assertOk()
        ->assertExactJson(['authenticated' => true]);

    $response = $this->getJson('/api/admin/bookings?date=2026-09-28')->assertOk();

    $response->assertJsonPath('date', '2026-09-28')
        ->assertJsonPath('hours.opensAt', '08:00')
        ->assertJsonPath('hours.closesAt', '17:00')
        ->assertJsonPath('hours.openDays', 'Monday to Saturday')
        ->assertJsonPath('hours.sunday', 'closed')
        ->assertJsonCount(2, 'bookings')
        ->assertJsonPath('bookings.0.reference', $earlier->json('reference'))
        ->assertJsonPath('bookings.0.startTime', '09:00')
        ->assertJsonPath('bookings.0.endTime', '09:30')
        ->assertJsonPath('bookings.0.serviceName', 'Line-Up & Edge Detail')
        ->assertJsonPath('bookings.0.customerName', 'Earlier Guest')
        ->assertJsonPath('bookings.0.email', 'early@example.com')
        ->assertJsonPath('bookings.0.phone', '+27 82 000 0001')
        ->assertJsonPath('bookings.1.reference', $later->json('reference'))
        ->assertJsonPath('bookings.1.startTime', '11:30');

    expect($response->json('bookings.0'))->not->toHaveKey('id')
        ->and($response->json('hours.publicHolidays'))->toContain('Monday to Saturday');
});

it('does not authenticate a failed admin login', function () {
    legendPrepareSpa();

    $this->postJson('/api/admin/login', [
        'username' => 'admin',
        'password' => 'wrong-password',
    ])->assertUnprocessable()
        ->assertJsonValidationErrors('username');

    $this->app['auth']->forgetGuards();

    legendPrepareSpa();

    $this->postJson('/api/admin/login', [
        'username' => 'someone-else',
        'password' => 'test-admin-password',
    ])->assertUnprocessable();

    $this->app['auth']->forgetGuards();

    $this->getJson('/api/admin/session')
        ->assertOk()
        ->assertExactJson(['authenticated' => false]);

    $this->getJson('/api/admin/bookings?date=2026-09-28')
        ->assertUnauthorized();
});

it('does not expose admin booking edit or delete routes', function () {
    $methods = collect(Route::getRoutes())
        ->filter(fn ($route) => str_contains($route->uri(), 'admin/bookings'))
        ->flatMap(fn ($route) => $route->methods())
        ->unique()
        ->values()
        ->all();

    expect($methods)->toContain('GET')
        ->and($methods)->not->toContain('POST', 'PUT', 'PATCH', 'DELETE');

    $this->putJson('/api/admin/bookings')->assertMethodNotAllowed();
    $this->patchJson('/api/admin/bookings')->assertMethodNotAllowed();
    $this->deleteJson('/api/admin/bookings')->assertMethodNotAllowed();
    $this->postJson('/api/admin/bookings')->assertMethodNotAllowed();
});

it('rejects an invalid admin bookings date', function () {
    legendAdminLogin();

    $this->getJson('/api/admin/bookings?date=yesterday')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('date');
});
