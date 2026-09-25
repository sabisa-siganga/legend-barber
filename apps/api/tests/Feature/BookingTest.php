<?php

use App\Models\Booking;
use App\Models\Service;
use Database\Seeders\ServiceSeeder;
use Illuminate\Database\UniqueConstraintViolationException;
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

it('returns active services with rand prices and hides inactive services', function () {
    Service::query()->whereKey('kids-cut')->update(['is_active' => false]);

    $services = $this->getJson('/api/services')->assertOk()->json();

    expect($services)->toHaveCount(5)
        ->and(collect($services)->pluck('id'))->not->toContain('kids-cut')
        ->and(collect($services)->firstWhere('id', 'signature-cut'))->toBe([
            'id' => 'signature-cut',
            'name' => 'Signature Cut',
            'price' => 220,
            'description' => 'A precise cut shaped for your everyday routine.',
        ]);
});

it('returns confirmation data and a 30 minute end time for a valid booking', function () {
    $response = $this->postJson('/api/bookings', legendBookingPayload())->assertCreated();
    $reference = $response->json('reference');

    expect($reference)->toBeString()->not->toMatch('/^\d+$/');

    $response->assertJsonPath('service', [
        'id' => 'signature-cut',
        'name' => 'Signature Cut',
        'price' => 220,
    ])
        ->assertJsonPath('date', '2026-09-26')
        ->assertJsonPath('startTime', '10:30')
        ->assertJsonPath('endTime', '11:00')
        ->assertJsonPath('location', '42 Kloof Street, Gardens, Cape Town')
        ->assertJsonPath('appleCalendarUrl', "/api/bookings/{$reference}/calendar.ics");

    $googleUrl = urldecode((string) $response->json('googleCalendarUrl'));

    expect($googleUrl)
        ->toContain('https://calendar.google.com/calendar/render')
        ->toContain('Crown & Blade - Signature Cut')
        ->toContain('20260926T103000')
        ->toContain('20260926T110000')
        ->toContain('Africa/Johannesburg')
        ->toContain('42 Kloof Street, Gardens, Cape Town');

    $booking = Booking::query()->where('reference', $reference)->first();

    expect($booking)->not->toBeNull()
        ->and($booking->service_name)->toBe('Signature Cut')
        ->and($booking->price_cents)->toBe(22000)
        ->and($booking->id)->not->toBe($reference);
});

it('rejects a second service booking for the same date and start time', function () {
    $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'signature-cut',
    ]))->assertCreated();

    $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'skin-fade',
        'customerName' => 'Sam Nkosi',
        'email' => 'sam@example.com',
    ]))->assertStatus(409)
        ->assertExactJson([
            'message' => 'That time was just booked. Please choose another available time.',
            'code' => 'slot_unavailable',
        ]);

    expect(Booking::query()->count())->toBe(1);
});

it('keeps exactly one booking when the same slot is requested twice', function () {
    $payload = legendBookingPayload();

    $this->postJson('/api/bookings', $payload)->assertCreated();
    $this->postJson('/api/bookings', $payload)->assertStatus(409)
        ->assertJsonPath('code', 'slot_unavailable');

    expect(Booking::query()->count())->toBe(1);
});

it('allows the same customer to book a different free slot', function () {
    $this->postJson('/api/bookings', legendBookingPayload([
        'startTime' => '10:30',
    ]))->assertCreated();

    $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'beard-shape-up',
        'startTime' => '11:00',
    ]))->assertCreated()
        ->assertJsonPath('endTime', '11:30');

    expect(Booking::query()->count())->toBe(2);
});

it('rejects a booking for an inactive service', function () {
    Service::query()->whereKey('kids-cut')->update(['is_active' => false]);

    $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'kids-cut',
    ]))->assertUnprocessable()
        ->assertJsonValidationErrors('serviceId');
});

it('returns 422 for invalid booking fields', function (array $overrides, string $field) {
    $this->postJson('/api/bookings', legendBookingPayload($overrides))
        ->assertUnprocessable()
        ->assertJsonValidationErrors($field);
})->with([
    'missing service' => [['serviceId' => ''], 'serviceId'],
    'unknown service' => [['serviceId' => 'not-a-service'], 'serviceId'],
    'past date' => [['date' => '2026-09-24'], 'date'],
    'sunday' => [['date' => '2026-09-27'], 'date'],
    'invalid slot' => [['startTime' => '10:15'], 'startTime'],
    'after closing' => [['startTime' => '17:00'], 'startTime'],
    'passed time today' => [['date' => '2026-09-25', 'startTime' => '09:00'], 'startTime'],
    'short name' => [['customerName' => 'J'], 'customerName'],
    'long name' => [['customerName' => str_repeat('A', 101)], 'customerName'],
    'invalid email' => [['email' => 'not-an-email'], 'email'],
    'short phone' => [['phone' => '12345'], 'phone'],
    'phone too short after trim' => [['phone' => '   12345   '], 'phone'],
    'phone too long' => [['phone' => str_repeat('1', 31)], 'phone'],
]);

it('stores a trimmed phone number', function () {
    $this->postJson('/api/bookings', legendBookingPayload([
        'phone' => '  +27 82 123 4567  ',
        'customerName' => '  Jane Doe  ',
    ]))->assertCreated();

    $booking = Booking::query()->first();

    expect($booking->phone)->toBe('+27 82 123 4567')
        ->and($booking->customer_name)->toBe('Jane Doe');
});

it('rejects a duplicate slot at the database when two rows share a start time', function () {
    $service = Service::query()->findOrFail('signature-cut');

    Booking::factory()->create([
        'service_id' => $service->id,
        'booking_date' => '2026-09-26',
        'start_time' => '10:30:00',
    ]);

    expect(fn () => Booking::factory()->create([
        'service_id' => $service->id,
        'booking_date' => '2026-09-26',
        'start_time' => '10:30:00',
    ]))->toThrow(UniqueConstraintViolationException::class);

    expect(Booking::query()->count())->toBe(1);
});

it('accepts a booking from any origin without a session csrf token', function () {
    $origin = 'https://demo.example';

    $this->withHeader('Origin', $origin)
        ->withHeader('Access-Control-Request-Method', 'POST')
        ->options('/api/bookings')
        ->assertNoContent()
        ->assertHeader('Access-Control-Allow-Origin', $origin)
        ->assertHeader('Access-Control-Allow-Credentials', 'true');

    $this->withHeader('Origin', $origin)
        ->withHeader('Referer', $origin.'/')
        ->postJson('/api/bookings', legendBookingPayload())
        ->assertCreated()
        ->assertHeader('Access-Control-Allow-Origin', $origin)
        ->assertJsonPath('service.id', 'signature-cut');
});

it('creates a booking from the spa after the csrf cookie is primed', function () {
    legendPrepareSpa();

    $this->postJson('/api/bookings', legendBookingPayload())
        ->assertCreated()
        ->assertJsonPath('service.id', 'signature-cut')
        ->assertJsonPath('startTime', '10:30');
});
