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

    $response->assertRedirect(route('projects.todos', $project));
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

    $response->assertRedirect(route('goals.opportunities', $goal));
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

    $response->assertRedirect(route('learning-items.todos', $learningItem));
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

    $response->assertRedirect(route('projects.todos', $project));
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

test('learning item todos tab lists its todos', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Step one', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('learning-items.todos', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/todos')
            ->has('todos.data', 1)
            ->where('todos.data.0.title', 'Step one'));
});

function learningItemPayload(array $overrides = []): array
{
    return [
        'title' => 'Test Learning Item',
        'description' => 'Learning description',
        'type' => 'book',
        'start_at' => now()->toDateTimeString(),
        ...$overrides,
    ];
}

function resourcePayload(array $overrides = []): array
{
    return [
        'title' => 'Test Resource',
        'description' => 'Resource description',
        'url' => 'https://example.com',
        'type' => 'article',
        ...$overrides,
    ];
}

test('storing a learning item in goal context links it and redirects to the goal', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    $response = $this->post(route('learning-items.store'), [
        ...learningItemPayload(),
        'goal_id' => $goal->id,
        'context' => 'goal',
    ]);

    $response->assertRedirect(route('goals.learning-items', $goal));
    $this->assertDatabaseHas('learning_items', [
        'user_id' => $user->id,
        'title' => 'Test Learning Item',
        'goal_id' => $goal->id,
    ]);
});

test('storing a learning item without goal context stays independent even with a tampered goal id', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    $response = $this->post(route('learning-items.store'), [
        ...learningItemPayload(),
        'goal_id' => $goal->id,
    ]);

    $learningItem = LearningItem::firstWhere('title', 'Test Learning Item');

    expect($learningItem->goal_id)->toBeNull();
    $response->assertRedirect(route('learning-items.show', $learningItem));
});

test('storing a learning item with another users goal id fails validation', function () {
    $user = createUser();
    $otherUser = createUser();
    $foreignGoal = createGoal($otherUser);
    $this->actingAs($user);

    $response = $this->post(route('learning-items.store'), [
        ...learningItemPayload(),
        'goal_id' => $foreignGoal->id,
        'context' => 'goal',
    ]);

    $response->assertInvalid('goal_id');
    $this->assertDatabaseCount('learning_items', 0);
});

test('storing a resource in learning item context links it and redirects to the learning item', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    $response = $this->post(route('resources.store'), [
        ...resourcePayload(),
        'learning_item_id' => $learningItem->id,
        'context' => 'learning_item',
    ]);

    $response->assertRedirect(route('learning-items.resources', $learningItem));
    $this->assertDatabaseHas('resources', [
        'user_id' => $user->id,
        'title' => 'Test Resource',
        'learning_item_id' => $learningItem->id,
    ]);
});

test('storing a resource without learning item context stays independent even with a tampered id', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    $response = $this->post(route('resources.store'), [
        ...resourcePayload(),
        'learning_item_id' => $learningItem->id,
    ]);

    $resource = Resource::firstWhere('title', 'Test Resource');

    expect($resource->learning_item_id)->toBeNull();
    $response->assertRedirect(route('resources.show', $resource));
});

test('storing a resource with another users learning item id fails validation', function () {
    $user = createUser();
    $otherUser = createUser();
    $foreignItem = createLearningItem($otherUser);
    $this->actingAs($user);

    $response = $this->post(route('resources.store'), [
        ...resourcePayload(),
        'learning_item_id' => $foreignItem->id,
        'context' => 'learning_item',
    ]);

    $response->assertInvalid('learning_item_id');
    $this->assertDatabaseCount('resources', 0);
});

test('resource index excludes learning item resources by default but includes them with scope all', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    Resource::create([...resourcePayload(['user_id' => $user->id, 'title' => 'Independent'])]);
    Resource::create([...resourcePayload(['user_id' => $user->id, 'title' => 'Learning linked', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('resources.index'))
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/index')
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'Independent'));

    $this->get(route('resources.index', ['scope' => 'all']))
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/index')
            ->has('resources.data', 2));
});

test('goal learning items tab lists its learning items', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    LearningItem::create([...learningItemPayload(['user_id' => $user->id, 'title' => 'Goal learning', 'goal_id' => $goal->id])]);

    $this->get(route('goals.learning-items', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/learning-items')
            ->has('learningItems.data', 1)
            ->where('learningItems.data.0.title', 'Goal learning'));
});

test('learning item show page lists its resources and goal', function () {
    $user = createUser();
    $goal = createGoal($user);
    $learningItem = createLearningItem($user);
    $learningItem->update(['goal_id' => $goal->id]);
    $this->actingAs($user);

    Resource::create([...resourcePayload(['user_id' => $user->id, 'title' => 'Linked resource', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('learning-items.resources', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/resources')
            ->where('learningItem.goal.id', $goal->id)
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'Linked resource'));
});

test('learning item create presets an owned goal and ignores a foreign one', function () {
    $user = createUser();
    $otherUser = createUser();
    $goal = createGoal($user);
    $foreignGoal = createGoal($otherUser);
    $this->actingAs($user);

    $this->get(route('learning-items.create', ['goal_id' => $goal->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/create')
            ->where('preset.goal.id', $goal->id));

    $this->get(route('learning-items.create', ['goal_id' => $foreignGoal->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('preset.goal', null));
});

test('resource create presets an owned learning item and ignores a foreign one', function () {
    $user = createUser();
    $otherUser = createUser();
    $learningItem = createLearningItem($user);
    $foreignItem = createLearningItem($otherUser);
    $this->actingAs($user);

    $this->get(route('resources.create', ['learning_item_id' => $learningItem->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->component('resources/create')
            ->where('preset.learningItem.id', $learningItem->id)
            ->where('preset.project', null)
            ->where('preset.goal', null));

    $this->get(route('resources.create', ['learning_item_id' => $foreignItem->id]))
        ->assertInertia(fn (Assert $page) => $page
            ->where('preset.learningItem', null));
});

test('project overview exposes child module counts', function () {
    $user = createUser();
    $project = createProject($user);
    $this->actingAs($user);

    Note::create(['user_id' => $user->id, 'title' => 'Project note', 'content' => 'Body', 'project_id' => $project->id]);
    Resource::create(['user_id' => $user->id, 'title' => 'Project resource', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'project_id' => $project->id]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Project todo', 'project_id' => $project->id])]);

    $this->get(route('projects.show', $project))
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/show')
            ->where('project.notes_count', 1)
            ->where('project.resources_count', 1)
            ->where('project.todos_count', 1));
});

test('project notes tab only lists notes for the project', function () {
    $user = createUser();
    $project = createProject($user);
    $otherProject = createProject($user);
    $this->actingAs($user);

    Note::create(['user_id' => $user->id, 'title' => 'In project', 'content' => 'Body', 'project_id' => $project->id]);
    Note::create(['user_id' => $user->id, 'title' => 'Other project', 'content' => 'Body', 'project_id' => $otherProject->id]);
    Note::create(['user_id' => $user->id, 'title' => 'Independent', 'content' => 'Body']);

    $this->get(route('projects.notes', $project))
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/notes')
            ->has('notes.data', 1)
            ->where('notes.data.0.title', 'In project'));
});

test('project resources tab only lists resources for the project', function () {
    $user = createUser();
    $project = createProject($user);
    $otherProject = createProject($user);
    $this->actingAs($user);

    Resource::create(['user_id' => $user->id, 'title' => 'In project', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'project_id' => $project->id]);
    Resource::create(['user_id' => $user->id, 'title' => 'Other project', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'project_id' => $otherProject->id]);

    $this->get(route('projects.resources', $project))
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/resources')
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'In project'));
});

test('project todos tab only lists todos for the project', function () {
    $user = createUser();
    $project = createProject($user);
    $otherProject = createProject($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'In project', 'project_id' => $project->id])]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Other project', 'project_id' => $otherProject->id])]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Independent'])]);

    $this->get(route('projects.todos', $project))
        ->assertInertia(fn (Assert $page) => $page
            ->component('projects/todos')
            ->has('todos.data', 1)
            ->where('todos.data.0.title', 'In project'));
});

test('project module tabs are forbidden for other users', function () {
    $owner = createUser();
    $otherUser = createUser();
    $project = createProject($owner);
    $this->actingAs($otherUser);

    $this->get(route('projects.notes', $project))->assertForbidden();
    $this->get(route('projects.resources', $project))->assertForbidden();
    $this->get(route('projects.todos', $project))->assertForbidden();
});

test('goal overview exposes child module counts', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    Project::create([
        'user_id' => $user->id,
        'goal_id' => $goal->id,
        'title' => 'Goal project',
        'description' => 'Project description',
        'status' => 'active',
        'start_date' => now()->toDateString(),
        'target_date' => now()->addMonth()->toDateString(),
    ]);
    Opportunity::create(['user_id' => $user->id, 'goal_id' => $goal->id, 'title' => 'Goal opp', 'description' => 'Desc', 'status' => 'new', 'source' => 'web', 'priority' => 'medium', 'estimated_value' => 'medium', 'next_action' => 'Call', 'due_date' => now()->addWeek()->toDateString()]);
    Note::create(['user_id' => $user->id, 'title' => 'Goal note', 'content' => 'Body', 'goal_id' => $goal->id]);
    Resource::create(['user_id' => $user->id, 'title' => 'Goal resource', 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'goal_id' => $goal->id]);
    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Goal todo', 'goal_id' => $goal->id])]);
    LearningItem::create([...learningItemPayload(['user_id' => $user->id, 'title' => 'Goal learning', 'goal_id' => $goal->id])]);

    $this->get(route('goals.show', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/show')
            ->where('goal.projects_count', 1)
            ->where('goal.opportunities_count', 1)
            ->where('goal.notes_count', 1)
            ->where('goal.resources_count', 1)
            ->where('goal.todos_count', 1)
            ->where('goal.learning_items_count', 1));
});

test('goal module tabs only list items for the goal', function () {
    $user = createUser();
    $goal = createGoal($user);
    $otherGoal = createGoal($user);
    $this->actingAs($user);

    foreach ([$goal, $otherGoal] as $index => $target) {
        $suffix = $index === 0 ? 'In goal' : 'Other goal';

        Project::create([
            'user_id' => $user->id,
            'goal_id' => $target->id,
            'title' => "{$suffix} project",
            'description' => 'Project description',
            'status' => 'active',
            'start_date' => now()->toDateString(),
            'target_date' => now()->addMonth()->toDateString(),
        ]);
        Opportunity::create(['user_id' => $user->id, 'goal_id' => $target->id, 'title' => "{$suffix} opp", 'description' => 'Desc', 'status' => 'new', 'source' => 'web', 'priority' => 'medium', 'estimated_value' => 'medium', 'next_action' => 'Call', 'due_date' => now()->addWeek()->toDateString()]);
        Note::create(['user_id' => $user->id, 'title' => "{$suffix} note", 'content' => 'Body', 'goal_id' => $target->id]);
        Resource::create(['user_id' => $user->id, 'title' => "{$suffix} resource", 'description' => 'Desc', 'url' => 'https://example.com', 'type' => 'article', 'goal_id' => $target->id]);
        Todo::create([...todoPayload(['user_id' => $user->id, 'title' => "{$suffix} todo", 'goal_id' => $target->id])]);
        LearningItem::create([...learningItemPayload(['user_id' => $user->id, 'title' => "{$suffix} learning", 'goal_id' => $target->id])]);
    }

    $this->get(route('goals.projects', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/projects')
            ->has('projects.data', 1)
            ->where('projects.data.0.title', 'In goal project'));

    $this->get(route('goals.opportunities', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/opportunities')
            ->has('opportunities.data', 1)
            ->where('opportunities.data.0.title', 'In goal opp'));

    $this->get(route('goals.notes', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/notes')
            ->has('notes.data', 1)
            ->where('notes.data.0.title', 'In goal note'));

    $this->get(route('goals.resources', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/resources')
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'In goal resource'));

    $this->get(route('goals.todos', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/todos')
            ->has('todos.data', 1)
            ->where('todos.data.0.title', 'In goal todo'));

    $this->get(route('goals.learning-items', $goal))
        ->assertInertia(fn (Assert $page) => $page
            ->component('goals/learning-items')
            ->has('learningItems.data', 1)
            ->where('learningItems.data.0.title', 'In goal learning'));
});

test('goal module tabs are forbidden for other users', function () {
    $owner = createUser();
    $otherUser = createUser();
    $goal = createGoal($owner);
    $this->actingAs($otherUser);

    $this->get(route('goals.projects', $goal))->assertForbidden();
    $this->get(route('goals.opportunities', $goal))->assertForbidden();
    $this->get(route('goals.notes', $goal))->assertForbidden();
    $this->get(route('goals.resources', $goal))->assertForbidden();
    $this->get(route('goals.todos', $goal))->assertForbidden();
    $this->get(route('goals.learning-items', $goal))->assertForbidden();
});

test('storing notes, resources and todos in goal context redirects to their goal tab', function () {
    $user = createUser();
    $goal = createGoal($user);
    $this->actingAs($user);

    $this->post(route('notes.store'), [
        'title' => 'Goal note',
        'content' => 'Body',
        'goal_id' => $goal->id,
        'context' => 'goal',
    ])->assertRedirect(route('goals.notes', $goal));

    $this->post(route('resources.store'), [
        ...resourcePayload(),
        'goal_id' => $goal->id,
        'context' => 'goal',
    ])->assertRedirect(route('goals.resources', $goal));

    $this->post(route('todos.store'), [
        ...todoPayload(),
        'goal_id' => $goal->id,
        'context' => 'goal',
    ])->assertRedirect(route('goals.todos', $goal));
});

test('learning item overview exposes child module counts', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $this->actingAs($user);

    Todo::create([...todoPayload(['user_id' => $user->id, 'title' => 'Item todo', 'learning_item_id' => $learningItem->id])]);
    Resource::create([...resourcePayload(['user_id' => $user->id, 'title' => 'Item resource', 'learning_item_id' => $learningItem->id])]);

    $this->get(route('learning-items.show', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/show')
            ->where('learningItem.todos_count', 1)
            ->where('learningItem.resources_count', 1));
});

test('learning item module tabs only list items for the learning item', function () {
    $user = createUser();
    $learningItem = createLearningItem($user);
    $learningItem->update(['title' => 'In item']);
    $otherItem = createLearningItem($user);
    $otherItem->update(['title' => 'Other item']);
    $this->actingAs($user);

    foreach ([$learningItem, $otherItem] as $target) {
        $suffix = $target->title;

        Todo::create([...todoPayload(['user_id' => $user->id, 'title' => "{$suffix} todo", 'learning_item_id' => $target->id])]);
        Resource::create([...resourcePayload(['user_id' => $user->id, 'title' => "{$suffix} resource", 'learning_item_id' => $target->id])]);
    }

    $this->get(route('learning-items.todos', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/todos')
            ->has('todos.data', 1)
            ->where('todos.data.0.title', 'In item todo'));

    $this->get(route('learning-items.resources', $learningItem))
        ->assertInertia(fn (Assert $page) => $page
            ->component('learning-items/resources')
            ->has('resources.data', 1)
            ->where('resources.data.0.title', 'In item resource'));
});

test('learning item module tabs are forbidden for other users', function () {
    $owner = createUser();
    $otherUser = createUser();
    $learningItem = createLearningItem($owner);
    $this->actingAs($otherUser);

    $this->get(route('learning-items.todos', $learningItem))->assertForbidden();
    $this->get(route('learning-items.resources', $learningItem))->assertForbidden();
});
