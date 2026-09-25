<?php

namespace App\Http\Requests;

use App\Services\AvailabilityService;
use Illuminate\Contracts\Validation\Validator;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

class StoreBookingRequest extends FormRequest
{
    public function authorize(): bool
    {
        return true;
    }

    protected function prepareForValidation(): void
    {
        $merge = [];

        if (is_string($this->input('customerName'))) {
            $merge['customerName'] = trim($this->input('customerName'));
        }

        if (is_string($this->input('email'))) {
            $merge['email'] = trim($this->input('email'));
        }

        if (is_string($this->input('phone'))) {
            $merge['phone'] = trim($this->input('phone'));
        }

        if ($merge !== []) {
            $this->merge($merge);
        }
    }

    /**
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            'serviceId' => [
                'required',
                'string',
                Rule::exists('services', 'id')->where('is_active', true),
            ],
            'date' => ['required', 'date_format:Y-m-d', 'after_or_equal:today'],
            'startTime' => ['required', 'date_format:H:i'],
            'customerName' => ['required', 'string', 'min:2', 'max:100'],
            'email' => ['required', 'string', 'email'],
            'phone' => ['required', 'string', 'min:7', 'max:30'],
        ];
    }

    /**
     * @return array<string, string>
     */
    public function messages(): array
    {
        return [
            'serviceId.required' => 'Choose a service.',
            'serviceId.exists' => 'Choose an active service.',
            'date.required' => 'Choose a date.',
            'date.date_format' => 'Enter a valid date.',
            'date.after_or_equal' => 'Choose today or a future date.',
            'startTime.required' => 'Choose a start time.',
            'startTime.date_format' => 'Choose a 30-minute time between 08:00 and 16:30.',
            'customerName.required' => 'Enter your name.',
            'customerName.min' => 'Enter a name between 2 and 100 characters.',
            'customerName.max' => 'Enter a name between 2 and 100 characters.',
            'email.required' => 'Enter your email address.',
            'email.email' => 'Enter a valid email address.',
            'phone.required' => 'Enter your phone number.',
            'phone.min' => 'Enter a phone number between 7 and 30 characters.',
            'phone.max' => 'Enter a phone number between 7 and 30 characters.',
        ];
    }

    public function withValidator(Validator $validator): void
    {
        $validator->after(function (Validator $validator): void {
            $date = $this->input('date');
            $startTime = $this->input('startTime');
            $availability = app(AvailabilityService::class);

            if (! is_string($date) || ! $availability->isCalendarDate($date)) {
                return;
            }

            if ($availability->isSunday($date)) {
                $validator->errors()->add('date', 'Crown & Blade is closed on Sundays.');
            }

            if (! is_string($startTime)) {
                return;
            }

            if (! $availability->isShopSlot($startTime)) {
                $validator->errors()->add(
                    'startTime',
                    'Choose a 30-minute time between 08:00 and 16:30.',
                );

                return;
            }

            if ($availability->hasStartTimePassed($date, $startTime)) {
                $validator->errors()->add('startTime', 'That time has already passed.');
            }
        });
    }
}
