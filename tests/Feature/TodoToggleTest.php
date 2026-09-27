<?php

use App\Models\Todo;
use App\Models\User;

function toggleUser(): User
{
    return User::factory()->create();
}

function toggleTodo(User $user, array $overrides = []): Todo
{
    return Todo::create([
        'user_id' => $user->id,
        'title' => 'Toggle Todo',
        'description' => 'Todo description',
        'status' => 'todo',
        'priority' => 'medium',
        'due_date' => now()->addWeek()->toDateString(),
        ...$overrides,
    ]);
}

test('toggling only status stays on the list and stamps completed_at', function () {
    $user = toggleUser();
    $todo = toggleTodo($user);
    $this->actingAs($user);

    $response = $this->from(route('todos.index'))->patch(route('todos.update', $todo), [
        'status' => 'completed',
    ]);

    $response->assertRedirect(route('todos.index'));
    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'status' => 'completed',
    ]);
    expect($todo->fresh()->completed_at)->not->toBeNull();
});

test('uncompleting a todo clears completed_at', function () {
    $user = toggleUser();
    $todo = toggleTodo($user, ['status' => 'completed', 'completed_at' => now()]);
    $this->actingAs($user);

    $response = $this->from(route('todos.index'))->patch(route('todos.update', $todo), [
        'status' => 'todo',
    ]);

    $response->assertRedirect(route('todos.index'));
    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'status' => 'todo',
        'completed_at' => null,
    ]);
});

test('full update still redirects to the show page', function () {
    $user = toggleUser();
    $todo = toggleTodo($user);
    $this->actingAs($user);

    $response = $this->patch(route('todos.update', $todo), [
        'title' => 'Renamed',
        'status' => 'in_progress',
    ]);

    $response->assertRedirect(route('todos.show', $todo));
    $this->assertDatabaseHas('todos', [
        'id' => $todo->id,
        'title' => 'Renamed',
        'status' => 'in_progress',
    ]);
});
