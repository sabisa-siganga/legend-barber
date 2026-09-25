<?php

namespace Database\Factories;

use App\Models\Booking;
use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Booking>
 */
class BookingFactory extends Factory
{
    protected $model = Booking::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'reference' => Str::uuid()->toString(),
            'service_id' => Service::factory(),
            'service_name' => 'Signature Cut',
            'price_cents' => 22000,
            'booking_date' => '2026-09-26',
            'start_time' => '10:30:00',
            'end_time' => '11:00:00',
            'customer_name' => 'Jane Doe',
            'email' => 'jane@example.com',
            'phone' => '+27 82 123 4567',
        ];
    }
}
