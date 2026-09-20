<?php

namespace App\Http\Controllers;

use App\Http\Requests\LearningItem\StoreLearningItemRequest;
use App\Http\Requests\LearningItem\UpdateLearningItemRequest;
use App\Models\LearningItem;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class LearningItemController extends Controller
{
    public function index(): Response
    {
        $learningItems = LearningItem::with('user')
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
        return Inertia::render('learning-items/create');
    }

    public function store(StoreLearningItemRequest $request): RedirectResponse
    {
        $learningItem = LearningItem::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('learning-items.show', $learningItem)
            ->with('success', 'Learning item created successfully.');
    }

    public function show(LearningItem $learningItem): Response
    {
        $this->authorize('view', $learningItem);

        $learningItem->load(['user', 'todos']);

        return Inertia::render('learning-items/show', [
            'learningItem' => $learningItem,
        ]);
    }

    public function edit(LearningItem $learningItem): Response
    {
        $this->authorize('update', $learningItem);

        return Inertia::render('learning-items/edit', [
            'learningItem' => $learningItem,
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
}
