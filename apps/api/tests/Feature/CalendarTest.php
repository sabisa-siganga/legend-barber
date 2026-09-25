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

it('downloads an ics file with the saved service date times and Gardens address', function () {
    $created = $this->postJson('/api/bookings', legendBookingPayload([
        'serviceId' => 'skin-fade',
        'date' => '2026-09-28',
        'startTime' => '14:00',
    ]))->assertCreated();

    $reference = $created->json('reference');

    $response = $this->get("/api/bookings/{$reference}/calendar.ics");

    $response->assertOk();

    expect($response->headers->get('Content-Type'))->toContain('text/calendar')
        ->and($response->headers->get('Content-Type'))->toContain('charset=utf-8')
        ->and($response->headers->get('Content-Disposition'))->toContain('.ics');

    $calendar = $response->getContent();

    expect($calendar)
        ->toContain('BEGIN:VCALENDAR')
        ->toContain('SUMMARY:Crown & Blade - Skin Fade')
        ->toContain('DTSTART;TZID=Africa/Johannesburg:20260928T140000')
        ->toContain('DTEND;TZID=Africa/Johannesburg:20260928T143000')
        ->toContain('LOCATION:42 Kloof Street\, Gardens\, Cape Town')
        ->not->toContain('DTSTART;TZID=Africa/Johannesburg:20260926T103000');
});

it('does not download a calendar file for an unknown reference', function () {
    $this->get('/api/bookings/00000000-0000-4000-8000-000000000000/calendar.ics')
        ->assertNotFound();
});
