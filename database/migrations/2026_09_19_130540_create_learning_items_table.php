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
        Schema::create('learning_items', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('goal_id')->nullable()->constrained();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->enum('type', ['book', 'course', 'tutorial', 'paper', 'article', 'video', 'documentation', 'website', 'other']);
            $table->dateTime('start_at')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_items');
    }
};
