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
            $table->foreignId('land_record_id')->constrained('land_records')->onDelete('cascade');
            $table->foreignId('from_owner_id')->constrained('users')->onDelete('cascade');
            $table->foreignId('to_owner_id')->constrained('users')->onDelete('cascade');
            $table->date('transfer_date');
            $table->decimal('transfer_value', 15, 2)->default(0);
            $table->string('reason')->nullable();
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->foreignId('processed_by')->nullable()->constrained('users')->onDelete('set null');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('land_transfers');
    }
};
