<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('bookings', function (Blueprint $table) {
            $table->id();
            $table->uuid('reference')->unique();
            $table->string('service_id');
            $table->foreign('service_id')->references('id')->on('services');
            $table->string('service_name');
            $table->unsignedInteger('price_cents');
            $table->date('booking_date');
            $table->time('start_time');
            $table->time('end_time');
            $table->string('customer_name');
            $table->string('email');
            $table->string('phone');
            $table->timestamps();

            $table->unique(['booking_date', 'start_time']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('bookings');
    }
};
