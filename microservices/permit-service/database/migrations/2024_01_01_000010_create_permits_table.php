<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('permits', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id');
            $table->string('permit_number')->unique();
            $table->string('applicant_name');
            $table->string('applicant_id');
            $table->enum('permit_type', ['building', 'business', 'environmental', 'health', 'trade', 'fire_safety']);
            $table->text('description');
            $table->string('location');
            $table->date('start_date')->nullable();
            $table->date('expiry_date')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'expired'])->default('submitted');
            $table->text('rejection_reason')->nullable();
            $table->unsignedBigInteger('approved_by')->nullable();
            $table->timestamp('approved_at')->nullable();
            $table->decimal('fee_amount', 10, 2)->default(0);
            $table->boolean('fee_paid')->default(false);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('permits');
    }
};
