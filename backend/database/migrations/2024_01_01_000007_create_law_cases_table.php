<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('law_cases', function (Blueprint $table) {
            $table->id();
            $table->string('case_number')->unique();
            $table->string('title');
            $table->text('description');
            $table->enum('case_type', ['civil', 'criminal', 'administrative', 'family', 'commercial', 'constitutional']);
            $table->string('plaintiff_name');
            $table->string('plaintiff_id')->nullable();
            $table->string('defendant_name');
            $table->string('defendant_id')->nullable();
            $table->string('presiding_officer');
            $table->date('filing_date');
            $table->date('hearing_date')->nullable();
            $table->date('verdict_date')->nullable();
            $table->enum('status', ['filed', 'pending', 'hearing', 'adjourned', 'verdict', 'closed', 'appealed'])->default('filed');
            $table->text('verdict')->nullable();
            $table->foreignId('assigned_officer_id')->nullable()->constrained('users')->onDelete('set null');
            $table->enum('priority', ['low', 'medium', 'high', 'urgent'])->default('medium');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('law_cases');
    }
};
