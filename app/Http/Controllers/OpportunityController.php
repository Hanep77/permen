<?php

namespace App\Http\Controllers;

use App\Http\Requests\Opportunity\StoreOpportunityRequest;
use App\Http\Requests\Opportunity\UpdateOpportunityRequest;
use App\Models\Goal;
use App\Models\Opportunity;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class OpportunityController extends Controller
{
    public function index(): Response
    {
        $opportunities = Opportunity::with(['goal', 'user'])
            ->where('user_id', request()->user()->id)
            ->when(request()->query('scope') !== 'all', function ($query) {
                $query->whereNull('goal_id');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('opportunities/index', [
            'opportunities' => $opportunities,
            'filters' => request()->only(['status', 'priority', 'goal_id', 'search', 'scope']),
        ]);
    }

    public function create(): Response
    {
        $userId = request()->user()->id;

        $goal = request()->filled('goal_id')
            ? Goal::where('user_id', $userId)->find(request()->query('goal_id'), ['id', 'title'])
            : null;

        $goals = Goal::where('user_id', $userId)
            ->get(['id', 'title']);

        return Inertia::render('opportunities/create', [
            'goals' => $goals,
            'preset' => [
                'goal' => $goal,
            ],
        ]);
    }

    public function store(StoreOpportunityRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $context = $validated['context'] ?? 'independent';
        unset($validated['context']);

        if ($context === 'independent') {
            $validated['goal_id'] = null;
        }

        $opportunity = Opportunity::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        if ($opportunity->goal_id) {
            return redirect()->route('goals.show', $opportunity->goal_id)
                ->with('success', 'Opportunity created successfully.');
        }

        return redirect()->route('opportunities.show', $opportunity)
            ->with('success', 'Opportunity created successfully.');
    }

    public function show(Opportunity $opportunity): Response
    {
        $this->authorize('view', $opportunity);

        $opportunity->load(['goal', 'user']);

        return Inertia::render('opportunities/show', [
            'opportunity' => $opportunity,
        ]);
    }

    public function edit(Opportunity $opportunity): Response
    {
        $this->authorize('update', $opportunity);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('opportunities/edit', [
            'opportunity' => $opportunity,
            'goals' => $goals,
        ]);
    }

    public function update(UpdateOpportunityRequest $request, Opportunity $opportunity): RedirectResponse
    {
        $this->authorize('update', $opportunity);

        $opportunity->update($request->validated());

        return redirect()->route('opportunities.show', $opportunity)
            ->with('success', 'Opportunity updated successfully.');
    }

    public function destroy(Opportunity $opportunity): RedirectResponse
    {
        $this->authorize('delete', $opportunity);

        $opportunity->delete();

        return redirect()->route('opportunities.index')
            ->with('success', 'Opportunity deleted successfully.');
    }
}
