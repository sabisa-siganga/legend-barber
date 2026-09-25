<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Service;
use Illuminate\Http\JsonResponse;

class ServiceController extends Controller
{
    public function index(): JsonResponse
    {
        $services = Service::query()
            ->where('is_active', true)
            ->orderBy('name')
            ->get()
            ->map(fn (Service $service) => [
                'id' => $service->id,
                'name' => $service->name,
                'price' => $service->priceInRands(),
                'description' => $service->description,
            ])
            ->values();

        return response()->json($services);
    }
}
