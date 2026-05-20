<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('citizen_registrations', function (Blueprint $table) {
            $table->id();
            $table->string('registration_number')->unique();
            $table->string('first_name');
            $table->string('last_name');
            $table->date('date_of_birth');
            $table->enum('gender', ['male', 'female', 'other']);
            $table->string('national_id')->unique();
            $table->string('passport_number')->nullable();
            $table->string('nationality');
            $table->enum('marital_status', ['single', 'married', 'divorced', 'widowed']);
            $table->string('address');
            $table->string('city');
            $table->string('region');
            $table->string('phone');
            $table->string('email')->nullable();
            $table->string('emergency_contact_name');
            $table->string('emergency_contact_phone');
            $table->enum('registration_type', ['birth', 'death', 'marriage', 'divorce', 'citizenship']);
            $table->enum('status', ['pending', 'verified', 'approved', 'rejected'])->default('pending');
            $table->foreignId('verified_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('citizen_registrations');
    }
};
