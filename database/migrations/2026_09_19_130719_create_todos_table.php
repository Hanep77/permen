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
        Schema::create('todos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained();
            $table->foreignId('project_id')->nullable()->constrained();
            $table->foreignId('goal_id')->nullable()->constrained();
            $table->foreignId('learning_item_id')->nullable()->constrained();
            $table->string('title', 100);
            $table->text('description')->nullable();
            $table->enum('status', ['todo', 'in_progress', 'completed', 'cancelled']);
            $table->enum('priority', ['low', 'medium', 'high']);
            $table->dateTime('due_date')->nullable();
            $table->dateTime('completed_at')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('todos');
    }
};
