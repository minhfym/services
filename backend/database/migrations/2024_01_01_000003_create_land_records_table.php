<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('owner_id')->constrained('users')->onDelete('cascade');
            $table->string('plot_number')->unique();
            $table->string('location');
            $table->string('district');
            $table->string('region');
            $table->decimal('area_sqm', 12, 2);
            $table->enum('land_use', ['residential', 'commercial', 'agricultural', 'industrial', 'public']);
            $table->string('title_deed_number');
            $table->date('registration_date');
            $table->decimal('current_value', 15, 2)->default(0);
            $table->enum('status', ['registered', 'under_transfer', 'disputed', 'mortgaged'])->default('registered');
            $table->text('encumbrances')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_records');
    }
};
