<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\AvailabilityService;
use App\Support\Shop;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AdminBookingController extends Controller
{
    public function __construct(private readonly AvailabilityService $availability) {}

    public function index(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'date' => ['required', 'date_format:Y-m-d'],
        ], [
            'date.required' => 'Enter a valid date.',
            'date.date_format' => 'Enter a valid date.',
        ]);

        $date = $validated['date'];

        if (! $this->availability->isCalendarDate($date)) {
            throw ValidationException::withMessages([
                'date' => 'Enter a valid date.',
            ]);
        }

        $bookings = Booking::query()
            ->whereDate('booking_date', $date)
            ->orderBy('start_time')
            ->get()
            ->map(fn (Booking $booking) => [
                'reference' => $booking->reference,
                'startTime' => $this->availability->clockTime($booking->start_time),
                'endTime' => $this->availability->clockTime($booking->end_time),
                'serviceName' => $booking->service_name,
                'price' => intdiv($booking->price_cents, 100),
                'customerName' => $booking->customer_name,
                'email' => $booking->email,
                'phone' => $booking->phone,
            ])
            ->values();

        return response()->json([
            'date' => $date,
            'hours' => Shop::hours(),
            'bookings' => $bookings,
        ]);
    }
}
