<?php

namespace App\Http\Controllers\Api;

use App\Exceptions\SlotUnavailableException;
use App\Http\Controllers\Controller;
use App\Http\Requests\StoreBookingRequest;
use App\Models\Booking;
use App\Models\Service;
use App\Services\AvailabilityService;
use App\Services\CalendarEventService;
use App\Support\Shop;
use Illuminate\Database\UniqueConstraintViolationException;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Illuminate\Validation\ValidationException;

class BookingController extends Controller
{
    public function __construct(
        private readonly AvailabilityService $availability,
        private readonly CalendarEventService $calendar,
    ) {}

    public function store(StoreBookingRequest $request): JsonResponse
    {
        try {
            $booking = DB::transaction(function () use ($request) {
                $date = $request->string('date')->toString();
                $startTime = $request->string('startTime')->toString();

                if (! $this->availability->acceptsBookingsOn($date)
                    || ! $this->availability->isShopSlot($startTime)
                    || $this->availability->hasStartTimePassed($date, $startTime)) {
                    throw ValidationException::withMessages([
                        'startTime' => 'Choose an available time.',
                    ]);
                }

                if ($this->availability->isBooked($date, $startTime, lock: true)) {
                    throw new SlotUnavailableException;
                }

                $service = Service::query()
                    ->where('is_active', true)
                    ->find($request->string('serviceId')->toString());

                if ($service === null) {
                    throw ValidationException::withMessages([
                        'serviceId' => 'Choose an active service.',
                    ]);
                }

                return Booking::query()->create([
                    'reference' => Str::uuid()->toString(),
                    'service_id' => $service->id,
                    'service_name' => $service->name,
                    'price_cents' => $service->price_cents,
                    'booking_date' => $date,
                    'start_time' => $this->availability->storedTime($startTime),
                    'end_time' => $this->availability->endTime($startTime),
                    'customer_name' => $request->string('customerName')->toString(),
                    'email' => $request->string('email')->toString(),
                    'phone' => $request->string('phone')->toString(),
                ]);
            });
        } catch (SlotUnavailableException|UniqueConstraintViolationException) {
            return $this->slotUnavailable();
        }

        return response()->json($this->confirmation($booking), 201);
    }

    /**
     * @return array<string, mixed>
     */
    private function confirmation(Booking $booking): array
    {
        return [
            'reference' => $booking->reference,
            'service' => [
                'id' => $booking->service_id,
                'name' => $booking->service_name,
                'price' => intdiv($booking->price_cents, 100),
            ],
            'date' => $booking->booking_date->toDateString(),
            'startTime' => $this->availability->clockTime($booking->start_time),
            'endTime' => $this->availability->clockTime($booking->end_time),
            'location' => Shop::LOCATION,
            'googleCalendarUrl' => $this->calendar->googleCalendarUrl($booking),
            'appleCalendarUrl' => $this->calendar->appleCalendarUrl($booking),
        ];
    }

    private function slotUnavailable(): JsonResponse
    {
        return response()->json([
            'message' => 'That time was just booked. Please choose another available time.',
            'code' => 'slot_unavailable',
        ], 409);
    }
}
