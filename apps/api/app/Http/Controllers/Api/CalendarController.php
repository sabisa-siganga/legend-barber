<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Booking;
use App\Services\CalendarEventService;
use Illuminate\Http\Response;

class CalendarController extends Controller
{
    public function __construct(private readonly CalendarEventService $calendar) {}

    public function show(string $reference): Response
    {
        $booking = Booking::query()->where('reference', $reference)->firstOrFail();
        $filename = $this->calendar->filename($booking);

        return response($this->calendar->ics($booking), 200, [
            'Content-Type' => 'text/calendar; charset=utf-8',
            'Content-Disposition' => 'attachment; filename="'.$filename.'"',
        ]);
    }
}
