<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('case_hearings', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('law_case_id');
            $table->date('hearing_date');
            $table->time('hearing_time');
            $table->string('venue');
            $table->text('outcome')->nullable();
            $table->date('next_hearing_date')->nullable();
            $table->text('notes')->nullable();
            $table->unsignedBigInteger('recorded_by');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('case_hearings');
    }
};
