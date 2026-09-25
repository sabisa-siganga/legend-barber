<?php

namespace App\Models;

use Database\Factories\ServiceFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

#[Fillable(['id', 'name', 'price_cents', 'description', 'is_active'])]
class Service extends Model
{
    /** @use HasFactory<ServiceFactory> */
    use HasFactory;

    public $incrementing = false;

    protected $keyType = 'string';

    /**
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'price_cents' => 'integer',
            'is_active' => 'boolean',
        ];
    }

    public function priceInRands(): int
    {
        return intdiv($this->price_cents, 100);
    }

    public function bookings(): HasMany
    {
        return $this->hasMany(Booking::class);
    }
}
