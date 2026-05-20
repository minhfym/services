<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('grants', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->enum('grant_type', ['education', 'agriculture', 'business', 'health', 'infrastructure', 'social']);
            $table->decimal('total_budget', 15, 2)->default(0);
            $table->decimal('available_budget', 15, 2)->default(0);
            $table->decimal('max_per_applicant', 15, 2)->default(0);
            $table->text('eligibility_criteria');
            $table->date('application_deadline');
            $table->date('disbursement_date')->nullable();
            $table->enum('status', ['open', 'closed', 'completed'])->default('open');
            $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('grants');
    }
};
