<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Http\Middleware\PreventRequestForgery;

class ValidateStatefulCsrfToken extends PreventRequestForgery
{
    /**
     * Sanctum only applies this middleware to first-party SPA requests.
     * The framework skip would let those requests create bookings during tests.
     */
    protected function runningUnitTests()
    {
        return false;
    }
}
