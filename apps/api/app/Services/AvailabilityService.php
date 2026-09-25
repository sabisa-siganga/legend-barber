<?php

namespace App\Services;

use App\Models\Booking;
use App\Support\Shop;
use Carbon\CarbonImmutable;
use DateTimeImmutable;
use DateTimeZone;

class AvailabilityService
{
    /**
     * @return list<string>
     */
    public function availableSlots(string $date): array
    {
        if (! $this->acceptsBookingsOn($date)) {
            return [];
        }

        $booked = $this->bookedStartTimes($date);

        return array_values(array_filter(
            $this->shopSlots(),
            fn (string $slot) => ! in_array($slot, $booked, true)
                && ! $this->hasStartTimePassed($date, $slot),
        ));
    }

    public function acceptsBookingsOn(string $date): bool
    {
        return $this->isCalendarDate($date)
            && ! $this->isPastDate($date)
            && ! $this->isSunday($date);
    }

    public function isCalendarDate(string $date): bool
    {
        $parsed = DateTimeImmutable::createFromFormat(
            '!Y-m-d',
            $date,
            new DateTimeZone(Shop::TIMEZONE),
        );

        $errors = DateTimeImmutable::getLastErrors();
        $warningCount = is_array($errors) ? $errors['warning_count'] : 0;
        $errorCount = is_array($errors) ? $errors['error_count'] : 0;

        return $parsed instanceof DateTimeImmutable
            && $warningCount === 0
            && $errorCount === 0
            && $parsed->format('Y-m-d') === $date;
    }

    public function isSunday(string $date): bool
    {
        if (! $this->isCalendarDate($date)) {
            return false;
        }

        return $this->date($date)->isSunday();
    }

    public function isPastDate(string $date): bool
    {
        if (! $this->isCalendarDate($date)) {
            return false;
        }

        return $this->date($date)->lt($this->today());
    }

    public function isShopSlot(string $startTime): bool
    {
        return in_array($startTime, $this->shopSlots(), true);
    }

    public function hasStartTimePassed(string $date, string $startTime): bool
    {
        if (! $this->isCalendarDate($date) || ! $this->isShopSlot($startTime)) {
            return false;
        }

        $start = CarbonImmutable::parse(
            $date.' '.$startTime,
            Shop::TIMEZONE,
        );

        return $start->lt($this->now());
    }

    public function isBooked(string $date, string $startTime, bool $lock = false): bool
    {
        $query = Booking::query()
            ->whereDate('booking_date', $date)
            ->where('start_time', $this->storedTime($startTime));

        if ($lock) {
            $query->lockForUpdate();
        }

        return $query->exists();
    }

    public function endTime(string $startTime): string
    {
        return CarbonImmutable::parse($startTime, Shop::TIMEZONE)
            ->addMinutes(Shop::SLOT_MINUTES)
            ->format('H:i:s');
    }

    public function storedTime(string $startTime): string
    {
        return CarbonImmutable::parse($startTime, Shop::TIMEZONE)->format('H:i:s');
    }

    public function clockTime(string $time): string
    {
        return CarbonImmutable::parse($time, Shop::TIMEZONE)->format('H:i');
    }

    /**
     * @return list<string>
     */
    public function shopSlots(): array
    {
        $slots = [];
        $cursor = CarbonImmutable::parse(Shop::OPENS_AT, Shop::TIMEZONE);
        $last = CarbonImmutable::parse(Shop::LAST_SLOT, Shop::TIMEZONE);

        while ($cursor->lessThanOrEqualTo($last)) {
            $slots[] = $cursor->format('H:i');
            $cursor = $cursor->addMinutes(Shop::SLOT_MINUTES);
        }

        return $slots;
    }

    /**
     * @return list<string>
     */
    private function bookedStartTimes(string $date): array
    {
        return Booking::query()
            ->whereDate('booking_date', $date)
            ->pluck('start_time')
            ->map(fn (string $time) => $this->clockTime($time))
            ->all();
    }

    private function date(string $date): CarbonImmutable
    {
        return CarbonImmutable::parse($date, Shop::TIMEZONE)->startOfDay();
    }

    private function today(): CarbonImmutable
    {
        return $this->now()->startOfDay();
    }

    private function now(): CarbonImmutable
    {
        return CarbonImmutable::now(Shop::TIMEZONE);
    }
}
