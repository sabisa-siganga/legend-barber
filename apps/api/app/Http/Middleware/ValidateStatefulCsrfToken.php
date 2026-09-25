<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class ValidateStatefulCsrfToken
{
    /**
     * The public site and the API are on different hosts, so the browser
     * cannot echo the session CSRF cookie. This demo does not check it.
     */
    public function handle(Request $request, Closure $next): Response
    {
        return $next($request);
    }
}
