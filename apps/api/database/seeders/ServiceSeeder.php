<?php

namespace Database\Seeders;

use App\Models\Service;
use Illuminate\Database\Seeder;

class ServiceSeeder extends Seeder
{
    public function run(): void
    {
        $services = [
            [
                'id' => 'signature-cut',
                'name' => 'Signature Cut',
                'price_cents' => 22000,
                'description' => 'A precise cut shaped for your everyday routine.',
            ],
            [
                'id' => 'skin-fade',
                'name' => 'Skin Fade',
                'price_cents' => 25000,
                'description' => 'Clean transitions, sharp finish and controlled detail.',
            ],
            [
                'id' => 'cut-beard-detail',
                'name' => 'Cut + Beard Detail',
                'price_cents' => 32000,
                'description' => 'A complete reset for your cut and beard line.',
            ],
            [
                'id' => 'beard-shape-up',
                'name' => 'Beard Shape-Up',
                'price_cents' => 15000,
                'description' => 'Defined edges and a cleaner beard profile.',
            ],
            [
                'id' => 'kids-cut',
                'name' => 'Kids Cut',
                'price_cents' => 16000,
                'description' => 'A comfortable, sharp cut for younger clients.',
            ],
            [
                'id' => 'line-up-edge-detail',
                'name' => 'Line-Up & Edge Detail',
                'price_cents' => 12000,
                'description' => 'Crisp lines for a clean in-between refresh.',
            ],
        ];

        foreach ($services as $service) {
            Service::query()->updateOrCreate(
                ['id' => $service['id']],
                [
                    ...$service,
                    'is_active' => true,
                ],
            );
        }
    }
}
