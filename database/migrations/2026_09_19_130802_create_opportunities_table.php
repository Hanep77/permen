<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('opportunities', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('goal_id')->nullable()->constrained();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->enum('status', ['new', 'considering', 'persuing', 'won', 'rejected', 'expired']);
            $table->string('source')->nullable();
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->enum('estimated_value', ['low', 'medium', 'high']);
            $table->text('next_action')->nullable();
            $table->dateTime('due_date')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('opportunities');
    }
};
