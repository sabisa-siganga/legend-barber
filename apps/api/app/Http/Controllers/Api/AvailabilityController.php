<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\AvailabilityService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AvailabilityController extends Controller
{
    public function __construct(private readonly AvailabilityService $availability) {}

    public function show(Request $request): JsonResponse
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

        return response()->json([
            'date' => $date,
            'slots' => $this->availability->availableSlots($date),
        ]);
    }
}
