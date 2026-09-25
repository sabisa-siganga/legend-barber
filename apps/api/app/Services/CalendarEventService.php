<?php

namespace App\Services;

use App\Models\Booking;
use App\Support\Shop;
use Carbon\CarbonImmutable;

class CalendarEventService
{
    public function googleCalendarUrl(Booking $booking): string
    {
        $query = http_build_query([
            'action' => 'TEMPLATE',
            'text' => $this->title($booking),
            'dates' => $this->googleDateTime($booking, 'start').'/'.$this->googleDateTime($booking, 'end'),
            'ctz' => Shop::TIMEZONE,
            'location' => Shop::LOCATION,
            'details' => $this->description($booking),
        ], '', '&', PHP_QUERY_RFC3986);

        return 'https://calendar.google.com/calendar/render?'.$query;
    }

    public function appleCalendarUrl(Booking $booking): string
    {
        return '/api/bookings/'.$booking->reference.'/calendar.ics';
    }

    public function ics(Booking $booking): string
    {
        $stamp = CarbonImmutable::now('UTC')->format('Ymd\THis\Z');
        $description = $this->escapeText($this->description($booking));
        $summary = $this->escapeText($this->title($booking));
        $location = $this->escapeText(Shop::LOCATION);

        $lines = [
            'BEGIN:VCALENDAR',
            'VERSION:2.0',
            'PRODID:-//Legend Barber//Bookings//EN',
            'CALSCALE:GREGORIAN',
            'METHOD:PUBLISH',
            'BEGIN:VTIMEZONE',
            'TZID:'.Shop::TIMEZONE,
            'X-LIC-LOCATION:'.Shop::TIMEZONE,
            'BEGIN:STANDARD',
            'TZOFFSETFROM:+0200',
            'TZOFFSETTO:+0200',
            'TZNAME:SAST',
            'DTSTART:19700101T000000',
            'END:STANDARD',
            'END:VTIMEZONE',
            'BEGIN:VEVENT',
            'UID:'.$booking->reference.'@legendbarber.test',
            'DTSTAMP:'.$stamp,
            'DTSTART;TZID='.Shop::TIMEZONE.':'.$this->icsDateTime($booking, 'start'),
            'DTEND;TZID='.Shop::TIMEZONE.':'.$this->icsDateTime($booking, 'end'),
            'SUMMARY:'.$summary,
            'LOCATION:'.$location,
            'DESCRIPTION:'.$description,
            'END:VEVENT',
            'END:VCALENDAR',
        ];

        return implode("\r\n", $lines)."\r\n";
    }

    public function filename(Booking $booking): string
    {
        return 'legend-barber-'.$booking->reference.'.ics';
    }

    public function title(Booking $booking): string
    {
        return Shop::NAME.' - '.$booking->service_name;
    }

    private function description(Booking $booking): string
    {
        return 'Legend Barber appointment for '.$booking->service_name.'.';
    }

    private function googleDateTime(Booking $booking, string $which): string
    {
        return $this->localDateTime($booking, $which)->format('Ymd\THis');
    }

    private function icsDateTime(Booking $booking, string $which): string
    {
        return $this->localDateTime($booking, $which)->format('Ymd\THis');
    }

    private function localDateTime(Booking $booking, string $which): CarbonImmutable
    {
        $time = $which === 'end' ? $booking->end_time : $booking->start_time;
        $date = $booking->booking_date->toDateString();

        return CarbonImmutable::parse($date.' '.$time, Shop::TIMEZONE);
    }

    private function escapeText(string $value): string
    {
        return str_replace(
            ['\\', ';', ',', "\n"],
            ['\\\\', '\\;', '\\,', '\\n'],
            $value,
        );
    }
}
