<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\AdminLoginRequest;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;

class AdminAuthController extends Controller
{
    public function login(AdminLoginRequest $request): JsonResponse
    {
        $authenticated = Auth::guard('admin')->attempt([
            'username' => $request->string('username')->toString(),
            'password' => $request->string('password')->toString(),
        ]);

        if (! $authenticated) {
            throw ValidationException::withMessages([
                'username' => 'The provided credentials are incorrect.',
            ]);
        }

        $request->session()->regenerate();

        return response()->json([
            'authenticated' => true,
        ]);
    }

    public function logout(Request $request): JsonResponse
    {
        Auth::guard('admin')->logout();
        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return response()->json([
            'authenticated' => false,
        ]);
    }

    public function session(): JsonResponse
    {
        return response()->json([
            'authenticated' => Auth::guard('admin')->check(),
        ]);
    }
}
