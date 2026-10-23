<?php

namespace App\Http\Controllers;

use App\Http\Requests\Goal\StoreGoalRequest;
use App\Http\Requests\Goal\UpdateGoalRequest;
use App\Models\Goal;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class GoalController extends Controller
{
    public function index(): Response
    {
        $goals = Goal::with('user')
            ->where('user_id', request()->user()->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('goals/index', [
            'goals' => $goals,
            'filters' => request()->only(['status', 'search']),
        ]);
    }

    public function create(): Response
    {
        return Inertia::render('goals/create');
    }

    public function store(StoreGoalRequest $request): RedirectResponse
    {
        $goal = Goal::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('goals.show', $goal)
            ->with('success', 'Goal created successfully.');
    }

    public function show(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/show', [
            'goal' => $this->goalWithCounts($goal),
        ]);
    }

    public function projects(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/projects', [
            'goal' => $this->goalWithCounts($goal),
            'projects' => $goal->projects()->latest()->paginate(10),
        ]);
    }

    public function opportunities(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/opportunities', [
            'goal' => $this->goalWithCounts($goal),
            'opportunities' => $goal->opportunities()->latest()->paginate(10),
        ]);
    }

    public function notes(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/notes', [
            'goal' => $this->goalWithCounts($goal),
            'notes' => $goal->notes()->latest()->paginate(10),
        ]);
    }

    public function resources(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/resources', [
            'goal' => $this->goalWithCounts($goal),
            'resources' => $goal->resources()->latest()->paginate(10),
        ]);
    }

    public function todos(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/todos', [
            'goal' => $this->goalWithCounts($goal),
            'todos' => $goal->todos()
                ->with(['project', 'goal', 'learningItem'])
                ->latest()
                ->paginate(10),
        ]);
    }

    public function learningItems(Goal $goal): Response
    {
        $this->authorize('view', $goal);

        return Inertia::render('goals/learning-items', [
            'goal' => $this->goalWithCounts($goal),
            'learningItems' => $goal->learningItems()->latest()->paginate(10),
        ]);
    }

    public function edit(Goal $goal): Response
    {
        $this->authorize('update', $goal);

        return Inertia::render('goals/edit', [
            'goal' => $goal,
        ]);
    }

    public function update(UpdateGoalRequest $request, Goal $goal): RedirectResponse
    {
        $this->authorize('update', $goal);

        $goal->update($request->validated());

        return redirect()->route('goals.show', $goal)
            ->with('success', 'Goal updated successfully.');
    }

    public function destroy(Goal $goal): RedirectResponse
    {
        $this->authorize('delete', $goal);

        $goal->delete();

        return redirect()->route('goals.index')
            ->with('success', 'Goal deleted successfully.');
    }

    private function goalWithCounts(Goal $goal): Goal
    {
        return $goal->load(['user'])
            ->loadCount(['projects', 'opportunities', 'notes', 'resources', 'todos', 'learningItems']);
    }
}
