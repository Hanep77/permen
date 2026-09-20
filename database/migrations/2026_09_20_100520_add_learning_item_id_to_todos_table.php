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
        if (Schema::hasColumn('todos', 'learning_item_id')) {
            return;
        }

        Schema::table('todos', function (Blueprint $table) {
            $table->foreignId('learning_item_id')->nullable()->constrained();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        if (! Schema::hasColumn('todos', 'learning_item_id')) {
            return;
        }

        Schema::table('todos', function (Blueprint $table) {
            $table->dropConstrainedForeignId('learning_item_id');
        });
    }
};
