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
    Route::get('goals/{goal}/projects', [GoalController::class, 'projects'])->name('goals.projects');
    Route::get('goals/{goal}/opportunities', [GoalController::class, 'opportunities'])->name('goals.opportunities');
    Route::get('goals/{goal}/notes', [GoalController::class, 'notes'])->name('goals.notes');
    Route::get('goals/{goal}/resources', [GoalController::class, 'resources'])->name('goals.resources');
    Route::get('goals/{goal}/todos', [GoalController::class, 'todos'])->name('goals.todos');
    Route::get('goals/{goal}/learning-items', [GoalController::class, 'learningItems'])->name('goals.learning-items');
    Route::resource('projects', ProjectController::class);
    Route::get('projects/{project}/notes', [ProjectController::class, 'notes'])->name('projects.notes');
    Route::get('projects/{project}/resources', [ProjectController::class, 'resources'])->name('projects.resources');
    Route::get('projects/{project}/todos', [ProjectController::class, 'todos'])->name('projects.todos');
    Route::resource('opportunities', OpportunityController::class);
    Route::resource('todos', TodoController::class);
    Route::resource('notes', NoteController::class);
    Route::resource('resources', ResourceController::class);
    Route::resource('learning-items', LearningItemController::class)->names('learning-items');
    Route::get('learning-items/{learning_item}/todos', [LearningItemController::class, 'todos'])->name('learning-items.todos');
    Route::get('learning-items/{learning_item}/resources', [LearningItemController::class, 'resources'])->name('learning-items.resources');
});

require __DIR__.'/settings.php';
