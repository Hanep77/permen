<?php

namespace App\Http\Controllers;

use App\Http\Requests\Resource\StoreResourceRequest;
use App\Http\Requests\Resource\UpdateResourceRequest;
use App\Models\Goal;
use App\Models\Project;
use App\Models\Resource;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ResourceController extends Controller
{
    public function index(): Response
    {
        $resources = Resource::with(['project', 'goal', 'user'])
            ->where('user_id', request()->user()->id)
            ->when(request()->query('scope') !== 'all', function ($query) {
                $query->whereNull('project_id')->whereNull('goal_id');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('resources/index', [
            'resources' => $resources,
            'filters' => request()->only(['type', 'project_id', 'goal_id', 'search', 'scope']),
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

        $projects = Project::where('user_id', $userId)
            ->get(['id', 'title']);

        $goals = Goal::where('user_id', $userId)
            ->get(['id', 'title']);

        return Inertia::render('resources/create', [
            'projects' => $projects,
            'goals' => $goals,
            'preset' => [
                'project' => $project,
                'goal' => $goal,
            ],
        ]);
    }

    public function store(StoreResourceRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $context = $validated['context'] ?? 'independent';
        unset($validated['context']);

        if ($context === 'independent') {
            $validated['project_id'] = null;
            $validated['goal_id'] = null;
        }

        $resource = Resource::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $parentTargets = [
            'project' => $resource->project_id ? ['projects.show', $resource->project_id] : null,
            'goal' => $resource->goal_id ? ['goals.show', $resource->goal_id] : null,
        ];

        foreach (array_unique([$context, 'project', 'goal']) as $key) {
            if (! empty($parentTargets[$key])) {
                return redirect()->route(...$parentTargets[$key])
                    ->with('success', 'Resource created successfully.');
            }
        }

        return redirect()->route('resources.show', $resource)
            ->with('success', 'Resource created successfully.');
    }

    public function show(Resource $resource): Response
    {
        $this->authorize('view', $resource);

        $resource->load(['project', 'goal', 'user']);

        return Inertia::render('resources/show', [
            'resource' => $resource,
        ]);
    }

    public function edit(Resource $resource): Response
    {
        $this->authorize('update', $resource);

        $projects = Project::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('resources/edit', [
            'resource' => $resource,
            'projects' => $projects,
            'goals' => $goals,
        ]);
    }

    public function update(UpdateResourceRequest $request, Resource $resource): RedirectResponse
    {
        $this->authorize('update', $resource);

        $resource->update($request->validated());

        return redirect()->route('resources.show', $resource)
            ->with('success', 'Resource updated successfully.');
    }

    public function destroy(Resource $resource): RedirectResponse
    {
        $this->authorize('delete', $resource);

        $resource->delete();

        return redirect()->route('resources.index')
            ->with('success', 'Resource deleted successfully.');
    }
}
