<?php

use Database\Seeders\ServiceSeeder;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Support\Carbon;

uses(RefreshDatabase::class);

beforeEach(function () {
    Carbon::setTestNow(Carbon::parse('2026-09-25 10:15:00', 'Africa/Johannesburg'));
    $this->seed(ServiceSeeder::class);
});

afterEach(function () {
    Carbon::setTestNow();
});

it('returns slots from 08:00 through 16:30 on an open weekday', function () {
    $this->getJson('/api/availability?date=2026-09-26')
        ->assertOk()
        ->assertExactJson([
            'date' => '2026-09-26',
            'slots' => [
                '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
                '11:00', '11:30', '12:00', '12:30', '13:00', '13:30',
                '14:00', '14:30', '15:00', '15:30', '16:00', '16:30',
            ],
        ]);
});

it('returns no slots on Sunday', function () {
    $this->getJson('/api/availability?date=2026-09-27')
        ->assertOk()
        ->assertExactJson([
            'date' => '2026-09-27',
            'slots' => [],
        ]);
});

it('returns no slots for a past date', function () {
    $this->getJson('/api/availability?date=2026-09-24')
        ->assertOk()
        ->assertExactJson([
            'date' => '2026-09-24',
            'slots' => [],
        ]);
});

it('excludes start times that have already passed today', function () {
    $response = $this->getJson('/api/availability?date=2026-09-25')->assertOk();

    expect($response->json('slots'))
        ->not->toContain('08:00', '10:00')
        ->and($response->json('slots.0'))->toBe('10:30')
        ->and($response->json('slots'))->toContain('16:30');
});

it('rejects an invalid availability date', function () {
    $this->getJson('/api/availability?date=09-25-2026')
        ->assertUnprocessable()
        ->assertJsonValidationErrors('date');
});

it('removes a saved booking slot from availability for every service', function () {
    $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'signature-cut',
        'date' => '2026-09-26',
        'startTime' => '10:30',
    ]))->assertCreated();

    $slots = $this->getJson('/api/availability?date=2026-09-26')->assertOk()->json('slots');

    expect($slots)->not->toContain('10:30')->and($slots)->toContain('10:00', '11:00');
});
