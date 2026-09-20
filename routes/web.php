<?php

use App\Http\Controllers\GoalController;
use App\Http\Controllers\LearningItemController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('goals', GoalController::class);
    Route::resource('projects', ProjectController::class);
    Route::resource('opportunities', OpportunityController::class);
    Route::resource('todos', TodoController::class);
    Route::resource('notes', NoteController::class);
    Route::resource('resources', ResourceController::class);
    Route::resource('learning-items', LearningItemController::class)->names('learning-items');
});

require __DIR__.'/settings.php';
