<?php

namespace App\Http\Controllers;

use App\Http\Requests\LearningItem\StoreLearningItemRequest;
use App\Http\Requests\LearningItem\UpdateLearningItemRequest;
use App\Models\Goal;
use App\Models\LearningItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LearningItemController extends Controller
{
    public function index(): Response
    {
        $learningItems = LearningItem::with(['user', 'goal'])
            ->where('user_id', request()->user()->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('learning-items/index', [
            'learningItems' => $learningItems,
            'filters' => request()->only(['type', 'search']),
        ]);
    }

    public function create(): Response
    {
        $userId = request()->user()->id;

        $goal = request()->filled('goal_id')
            ? Goal::where('user_id', $userId)->find(request()->query('goal_id'), ['id', 'title'])
            : null;

        return Inertia::render('learning-items/create', [
            'preset' => [
                'goal' => $goal,
            ],
        ]);
    }

    public function store(StoreLearningItemRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $context = $validated['context'] ?? 'independent';
        unset($validated['context']);

        if ($context === 'independent') {
            $validated['goal_id'] = null;
        }

        $learningItem = LearningItem::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        if ($context === 'goal' && $learningItem->goal_id) {
            return redirect()->route('goals.learning-items', $learningItem->goal_id)
                ->with('success', 'Learning item created successfully.');
        }

        return redirect()->route('learning-items.show', $learningItem)
            ->with('success', 'Learning item created successfully.');
    }

    public function show(LearningItem $learningItem): Response
    {
        $this->authorize('view', $learningItem);

        return Inertia::render('learning-items/show', [
            'learningItem' => $this->learningItemWithCounts($learningItem),
        ]);
    }

    public function todos(LearningItem $learningItem): Response
    {
        $this->authorize('view', $learningItem);

        return Inertia::render('learning-items/todos', [
            'learningItem' => $this->learningItemWithCounts($learningItem),
            'todos' => $learningItem->todos()
                ->with(['project', 'goal', 'learningItem'])
                ->latest()
                ->paginate(10),
        ]);
    }

    public function resources(LearningItem $learningItem): Response
    {
        $this->authorize('view', $learningItem);

        return Inertia::render('learning-items/resources', [
            'learningItem' => $this->learningItemWithCounts($learningItem),
            'resources' => $learningItem->resources()->latest()->paginate(10),
        ]);
    }

    public function edit(LearningItem $learningItem): Response
    {
        $this->authorize('update', $learningItem);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('learning-items/edit', [
            'learningItem' => $learningItem,
            'goals' => $goals,
        ]);
    }

    public function update(UpdateLearningItemRequest $request, LearningItem $learningItem): RedirectResponse
    {
        $this->authorize('update', $learningItem);

        $learningItem->update($request->validated());

        return redirect()->route('learning-items.show', $learningItem)
            ->with('success', 'Learning item updated successfully.');
    }

    public function destroy(LearningItem $learningItem): RedirectResponse
    {
        $this->authorize('delete', $learningItem);

        $learningItem->delete();

        return redirect()->route('learning-items.index')
            ->with('success', 'Learning item deleted successfully.');
    }

    private function learningItemWithCounts(LearningItem $learningItem): LearningItem
    {
        return $learningItem->load(['user', 'goal'])
            ->loadCount(['todos', 'resources']);
    }
}
