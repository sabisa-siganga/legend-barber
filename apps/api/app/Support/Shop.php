<?php

namespace App\Support;

final class Shop
{
    public const NAME = 'Legend Barber';

    public const TIMEZONE = 'Africa/Johannesburg';

    public const LOCATION = '42 Kloof Street, Gardens, Cape Town';

    public const OPENS_AT = '08:00';

    public const CLOSES_AT = '17:00';

    public const LAST_SLOT = '16:30';

    public const SLOT_MINUTES = 30;

    /**
     * @return array{
     *     opensAt: string,
     *     closesAt: string,
     *     openDays: string,
     *     sunday: string,
     *     publicHolidays: string
     * }
     */
    public static function hours(): array
    {
        return [
            'opensAt' => self::OPENS_AT,
            'closesAt' => self::CLOSES_AT,
            'openDays' => 'Monday to Saturday',
            'sunday' => 'closed',
            'publicHolidays' => 'Public holidays remain open when they fall Monday to Saturday.',
        ];
    }
}
