<?php

use App\Http\Controllers\GoalController;
use App\Http\Controllers\LearningItemController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\OpportunityController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ResourceController;
use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::redirect('/', '/dashboard')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    Route::resource('goals', GoalController::class);
    Route::resource('projects', ProjectController::class);
    Route::get('projects/{project}/notes', [ProjectController::class, 'notes'])->name('projects.notes');
    Route::get('projects/{project}/resources', [ProjectController::class, 'resources'])->name('projects.resources');
    Route::get('projects/{project}/todos', [ProjectController::class, 'todos'])->name('projects.todos');
    Route::resource('opportunities', OpportunityController::class);
    Route::resource('todos', TodoController::class);
    Route::resource('notes', NoteController::class);
    Route::resource('resources', ResourceController::class);
    Route::resource('learning-items', LearningItemController::class)->names('learning-items');
});

require __DIR__.'/settings.php';
