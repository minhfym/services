<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('land_transfers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('land_record_id');
            $table->unsignedBigInteger('from_owner_id');
            $table->unsignedBigInteger('to_owner_id');
            $table->date('transfer_date');
            $table->decimal('transfer_value', 15, 2);
            $table->string('reason');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->unsignedBigInteger('processed_by')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_transfers');
    }
};
