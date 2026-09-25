<?php

use App\Http\Controllers\Api\AdminAuthController;
use App\Http\Controllers\Api\AdminBookingController;
use App\Http\Controllers\Api\AvailabilityController;
use App\Http\Controllers\Api\BookingController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\ServiceController;
use Illuminate\Support\Facades\Route;

Route::get('/health', function () {
    return response()->json([
        'status' => 'ok',
        'service' => 'legend-barber-api',
    ]);
});

Route::get('/services', [ServiceController::class, 'index']);
Route::get('/availability', [AvailabilityController::class, 'show']);
Route::post('/bookings', [BookingController::class, 'store']);
Route::get('/bookings/{reference}/calendar.ics', [CalendarController::class, 'show']);

Route::post('/admin/login', [AdminAuthController::class, 'login']);
Route::post('/admin/logout', [AdminAuthController::class, 'logout']);
Route::get('/admin/session', [AdminAuthController::class, 'session']);
Route::get('/admin/bookings', [AdminBookingController::class, 'index'])
    ->middleware('auth:sanctum');
