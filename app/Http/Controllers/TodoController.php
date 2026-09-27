<?php

namespace App\Http\Controllers;

use App\Enums\TodoStatus;
use App\Http\Requests\Todo\StoreTodoRequest;
use App\Http\Requests\Todo\UpdateTodoRequest;
use App\Models\Goal;
use App\Models\LearningItem;
use App\Models\Project;
use App\Models\Todo;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class TodoController extends Controller
{
    public function index(): Response
    {
        $todos = Todo::with(['project', 'goal', 'learningItem', 'user'])
            ->where('user_id', request()->user()->id)
            ->when(request()->query('scope') !== 'all', function ($query) {
                $query->whereNull('project_id')->whereNull('goal_id')->whereNull('learning_item_id');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('todos/index', [
            'todos' => $todos,
            'filters' => request()->only(['status', 'priority', 'project_id', 'goal_id', 'learning_item_id', 'search', 'scope']),
        ]);
    }

    public function create(): Response
    {
        $userId = request()->user()->id;

        $project = request()->filled('project_id')
            ? Project::where('user_id', $userId)->find(request()->query('project_id'), ['id', 'title'])
            : null;

        $goal = request()->filled('goal_id')
            ? Goal::where('user_id', $userId)->find(request()->query('goal_id'), ['id', 'title'])
            : null;

        $learningItem = request()->filled('learning_item_id')
            ? LearningItem::where('user_id', $userId)->find(request()->query('learning_item_id'), ['id', 'title'])
            : null;

        return Inertia::render('todos/create', [
            'preset' => [
                'project' => $project,
                'goal' => $goal,
                'learningItem' => $learningItem,
            ],
        ]);
    }

    public function store(StoreTodoRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $context = $validated['context'] ?? 'independent';
        unset($validated['context']);

        if ($context === 'independent') {
            $validated['project_id'] = null;
            $validated['goal_id'] = null;
            $validated['learning_item_id'] = null;
        }

        $todo = Todo::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $parentTargets = [
            'project' => $todo->project_id ? ['projects.show', $todo->project_id] : null,
            'goal' => $todo->goal_id ? ['goals.show', $todo->goal_id] : null,
            'learning_item' => $todo->learning_item_id ? ['learning-items.show', $todo->learning_item_id] : null,
        ];

        foreach (array_unique([$context, 'project', 'goal', 'learning_item']) as $key) {
            if (! empty($parentTargets[$key])) {
                return redirect()->route(...$parentTargets[$key])
                    ->with('success', 'Todo created successfully.');
            }
        }

        return redirect()->route('todos.show', $todo)
            ->with('success', 'Todo created successfully.');
    }

    public function show(Todo $todo): Response
    {
        $this->authorize('view', $todo);

        $todo->load(['project', 'goal', 'learningItem', 'user']);

        return Inertia::render('todos/show', [
            'todo' => $todo,
        ]);
    }

    public function edit(Todo $todo): Response
    {
        $this->authorize('update', $todo);

        $projects = Project::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        $learningItems = LearningItem::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('todos/edit', [
            'todo' => $todo,
            'projects' => $projects,
            'goals' => $goals,
            'learningItems' => $learningItems,
        ]);
    }

    public function update(UpdateTodoRequest $request, Todo $todo): RedirectResponse
    {
        $this->authorize('update', $todo);

        $validated = $request->validated();

        $isStatusToggle = count($validated) === 1 && array_key_exists('status', $validated);

        if (array_key_exists('status', $validated)) {
            $validated['completed_at'] = $validated['status'] === TodoStatus::Completed->value
                ? ($validated['completed_at'] ?? now())
                : null;
        }

        $todo->update($validated);

        if ($isStatusToggle) {
            return back()->with('success', 'Todo updated successfully.');
        }

        return redirect()->route('todos.show', $todo)
            ->with('success', 'Todo updated successfully.');
    }

    public function destroy(Todo $todo): RedirectResponse
    {
        $this->authorize('delete', $todo);

        $todo->delete();

        return redirect()->route('todos.index')
            ->with('success', 'Todo deleted successfully.');
    }
}
