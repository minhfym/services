<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grant_applications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('grant_id');
            $table->unsignedBigInteger('applicant_id');
            $table->string('application_number')->unique();
            $table->text('purpose');
            $table->decimal('amount_requested', 12, 2);
            $table->decimal('amount_approved', 12, 2)->nullable();
            $table->json('supporting_documents')->nullable();
            $table->enum('status', ['draft', 'submitted', 'under_review', 'approved', 'rejected', 'disbursed'])->default('submitted');
            $table->text('review_notes')->nullable();
            $table->unsignedBigInteger('reviewed_by')->nullable();
            $table->timestamp('reviewed_at')->nullable();
            $table->timestamp('disbursed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grant_applications');
    }
};
