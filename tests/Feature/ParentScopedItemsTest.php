<?php

use App\Models\Goal;
use App\Models\LearningItem;
use App\Models\Note;
use App\Models\Opportunity;
use App\Models\Project;
use App\Models\Resource;
use App\Models\Todo;
use App\Models\User;
use Inertia\Testing\AssertableInertia as Assert;

function createUser(): User
{
    return User::factory()->create();
}

function createProject(User $user): Project
{
    return Project::create([
        'user_id' => $user->id,
        'title' => 'Test Project',
        'description' => 'Project description',
        'status' => 'active',
        'start_date' => now()->toDateString(),
        'target_date' => now()->addMonth()->toDateString(),
    ]);
}

function createGoal(User $user): Goal
{
    return Goal::create([
        'user_id' => $user->id,
        'title' => 'Test Goal',
        'description' => 'Goal description',
        'status' => 'active',
        'start_date' => now()->toDateString(),
        'target_date' => now()->addMonth()->toDateString(),
    ]);
}

function createLearningItem(User $user): LearningItem
{
    return LearningItem::create([
        'user_id' => $user->id,
        'title' => 'Test Learning Item',
        'description' => 'Learning description',
        'type' => 'book',
        'start_at' => now()->toDateTimeString(),
    ]);
}

function todoPayload(array $overrides = []): array
{
    return [
        'title' => 'Test Todo',
        'description' => 'Todo description',
        'status' => 'todo',
        'priority' => 'medium',
        'due_date' => now()->addWeek()->toDateString(),
        ...$overrides,
    ];
}

test('todo index shows independent todos by default', function () {
    $user = createUser();
    $project = createProject($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Independent'])]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Linked', 'project_id' => $project->id])]);

    $response = $this->get(route('todos.index'));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('todos/index')
        ->has('todos.data', 1)
        ->where('todos.data.0.title', 'Independent'));
});

test('todo index shows linked todos when scope is all', function () {
    $user = createUser();
    $project = createProject($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Independent'])]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Linked', 'project_id' => $project->id])]);

    $response = $this->get(route('todos.index', ['scope' => 'all']));

    $response->assertOk();
    $response->assertInertia(fn (Assert $page) => $page
        ->component('todos/index')
        ->has('todos.data', 2));
});

test('note, resource and opportunity indexes show independent items by default', function () {
    $user = createUser();
    $project = createProject($user);
    $goal = createGoal($user);
    $this->actingAs($user);

    Note::create(['user_id' => $user->id, 'title' => 'Solo note', 'content' => 'Body']);
    Note::create(['user_id' => $user->id, 'title' => 'Linked note', 'content' => 'Body', 'project_id' => $project->id]);

    Resource::create(['user_id' => $user->id, 'title' => 'Solo resource', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article']);
    Resource::create(['user_id' => $user->id, 'title' => 'Linked resource', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'goal_id' => $goal->id]);

    Opportunity::create(['user_id' => $user->id, 'title' => 'Solo opp', 'description' => 'Desc', 'status' => 'new', 'source' => 'web', 'priority' => 'medium', 'estimated_value' => 'medium', 'next_action' => 'Call', 'due_date' => now()->addWeek()->toDateString()]);
    Opportunity::create(['user_id' => $user->id, 'title' => 'Linked opp', 'description' => 'Desc', 'status' => 'new', 'source' => 'web', 'priority' => 'medium', 'estimated_value' => 'medium', 'next_action' => 'Call', 'due_date' => now()->addWeek()->toDateString(), 'goal_id' => $goal->id]);

    $this->get(route('notes.index'))->assertInertia(fn (Assert $page) => $page
        ->component('notes/index')
        ->has('notes.data', 1)
        ->where('notes.data.0.title', 'Solo note'));

    $this->get(route('resources.index'))->assertInertia(fn (Assert $page) => $page
        ->component('resources/index')
        ->has('resources.data', 1)
        ->where('resources.data.0.title', 'Solo resource'));

    $this->get(route('opportunities.index'))->assertInertia(fn (Assert $page) => $page
        ->component('opportunities/index')
        ->has('opportunities.data', 1)
        ->where('opportunities.data.0.title', 'Solo opp'));
});

test('todo create presets an owned project and ignores a foreign one', function () {
    $user = createUser();
    $otherUser = createUser();
    $project = createProject($user);
    $foreignProject = createProject($otherUser);
    $this->actingAs($user);

    $this->get(route('todos.create', ['project_id' => $project->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/create')
            ->where('preset.project.id', $project->id)
            ->where('preset.goal', null));

    $this->get(route('todos.create', ['project_id' => $foreignProject->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/create')
            ->where('preset.project', null));
});

test('storing a todo in project context links it and redirects to the project', function () {
    $user = createUser();
    $project = createProject($user);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'project_id' => $project->id,
        'context' => 'project',
    ]);

    $response->assertRedirect(route('projects.show', $project));
    $this->assertDatabaseHas('todos', [
        'user_id' => $user->id,
        'title' => 'Test Todo',
        'project_id' => $project->id,
    ]);
});

test('storing a todo without project context stays independent even with a tampered project id', function () {
    $user = createUser();
    $project = createProject($user);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'project_id' => $project->id,
    ]);

    $todo = Todo::firstWhere('title', 'Test Todo');

    expect($todo->project_id)->toBeNull();
    $response->assertRedirect(route('todos.show', $todo));
});

test('storing a todo with another users project id fails validation', function () {
    $user = createUser();
    $otherUser = createUser();
    $foreignProject = createProject($otherUser);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'project_id' => $foreignProject->id,
        'context' => 'project',
    ]);

    $response->assertInvalid('project_id');
    $this->assertDatabaseCount('todos', 0);
});

test('storing an opportunity in goal context links it and redirects to the goal', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    $response = $this->post(route('opportunities.store'), [
        'title' => 'Test Opp',
        'description' => 'Desc',
        'status' => 'new',
        'source' => 'web',
        'priority' => 'medium',
        'estimated_value' => 'medium',
        'next_action' => 'Call',
        'due_date' => now()->addWeek()->toDateString(),
        'goal_id' => $goal->id,
        'context' => 'goal',
    ]);

    $response->assertRedirect(route('goals.show', $goal));
    $this->assertDatabaseHas('opportunities', [
        'user_id' => $user->id,
        'title' => 'Test Opp',
        'goal_id' => $goal->id,
    ]);
});

test('todo index excludes learning item todos by default but includes them with scope all', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Independent'])]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Learning linked', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('todos.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/index')
            ->has('todos.data', 1)
            ->where('todos.data.0.title', 'Independent'));

    $this->get(route('todos.index', ['scope' => 'all']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/index')
            ->has('todos.data', 2));
});

test('todo create presets an owned learning item and ignores a foreign one', function () {
    $user = createUser();
    $otherUser = createUser();
    $learningItem = createLearningItem($user);
    $foreignItem = createLearningItem($otherUser);
    $this->actingAs($user);

    $this->get(route('todos.create', ['learning_item_id' => $learningItem->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/create')
            ->where('preset.learningItem.id', $learningItem->id)
            ->where('preset.project', null)
            ->where('preset.goal', null));

    $this->get(route('todos.create', ['learning_item_id' => $foreignItem->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('todos/create')
            ->where('preset.learningItem', null));
});

test('storing a todo in learning item context links it and redirects to the learning item', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'learning_item_id' => $learningItem->id,
        'context' => 'learning_item',
    ]);

    $response->assertRedirect(route('learning-items.show', $learningItem));
    $this->assertDatabaseHas('todos', [
        'user_id' => $user->id,
        'title' => 'Test Todo',
        'learning_item_id' => $learningItem->id,
    ]);
});

test('storing a todo in project context keeps an additional goal link', function () {
    $user = createUser();
    $project = createProject($user);
    $goal = createGoal($user);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'project_id' => $project->id,
        'goal_id' => $goal->id,
        'context' => 'project',
    ]);

    $response->assertRedirect(route('projects.show', $project));
    $this->assertDatabaseHas('todos', [
        'user_id' => $user->id,
        'title' => 'Test Todo',
        'project_id' => $project->id,
        'goal_id' => $goal->id,
    ]);
});

test('storing a todo with another users learning item id fails validation', function () {
    $user = createUser();
    $otherUser = createUser();
    $foreignItem = createLearningItem($otherUser);
    $this->actingAs($user);

    $response = $this->post(route('todos.store'), [
        ...todoPayload(),
        'learning_item_id' => $foreignItem->id,
        'context' => 'learning_item',
    ]);

    $response->assertInvalid('learning_item_id');
    $this->assertDatabaseCount('todos', 0);
});

test('learning item show page lists its todos', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Step one', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('learning-items.show', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/show')
            ->has('learningItem.todos', 1)
            ->where('learningItem.todos.0.title', 'Step one'));
});
