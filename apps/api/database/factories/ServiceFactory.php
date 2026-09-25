<?php

namespace Database\Factories;

use App\Models\Service;
use Illuminate\Database\Eloquent\Factories\Factory;
use Illuminate\Support\Str;

/**
 * @extends Factory<Service>
 */
class ServiceFactory extends Factory
{
    protected $model = Service::class;

    /**
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'id' => Str::uuid()->toString(),
            'name' => 'Signature Cut',
            'price_cents' => 22000,
            'description' => 'A precise cut shaped for your everyday routine.',
            'is_active' => true,
        ];
    }
}
