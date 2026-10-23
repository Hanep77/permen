<?php

namespace App\Http\Controllers;

use App\Enums\GoalStatus;
use App\Http\Requests\Project\StoreProjectRequest;
use App\Http\Requests\Project\UpdateProjectRequest;
use App\Models\Goal;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class ProjectController extends Controller
{
    public function index(): Response
    {
        $projects = Project::with(['goal', 'user'])
            ->where('user_id', request()->user()->id)
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('projects/index', [
            'projects' => $projects,
            'filters' => request()->only(['status', 'goal_id', 'search']),
        ]);
    }

    public function create(): Response
    {
        $goals = Goal::where('user_id', request()->user()->id)
            ->where('status', '!=', GoalStatus::Completed)
            ->get(['id', 'title']);

        return Inertia::render('projects/create', [
            'goals' => $goals,
        ]);
    }

    public function store(StoreProjectRequest $request): RedirectResponse
    {
        $project = Project::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project created successfully.');
    }

    public function show(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/show', [
            'project' => $this->projectWithCounts($project),
        ]);
    }

    public function notes(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/notes', [
            'project' => $this->projectWithCounts($project),
            'notes' => $project->notes()->latest()->paginate(10),
        ]);
    }

    public function resources(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/resources', [
            'project' => $this->projectWithCounts($project),
            'resources' => $project->resources()->latest()->paginate(10),
        ]);
    }

    public function todos(Project $project): Response
    {
        $this->authorize('view', $project);

        return Inertia::render('projects/todos', [
            'project' => $this->projectWithCounts($project),
            'todos' => $project->todos()
                ->with(['project', 'goal', 'learningItem'])
                ->latest()
                ->paginate(10),
        ]);
    }

    public function edit(Project $project): Response
    {
        $this->authorize('update', $project);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('projects/edit', [
            'project' => $project,
            'goals' => $goals,
        ]);
    }

    public function update(UpdateProjectRequest $request, Project $project): RedirectResponse
    {
        $this->authorize('update', $project);

        $project->update($request->validated());

        return redirect()->route('projects.show', $project)
            ->with('success', 'Project updated successfully.');
    }

    public function destroy(Project $project): RedirectResponse
    {
        $this->authorize('delete', $project);

        $project->delete();

        return redirect()->route('projects.index')
            ->with('success', 'Project deleted successfully.');
    }

    private function projectWithCounts(Project $project): Project
    {
        return $project->load(['goal', 'user'])
            ->loadCount(['notes', 'resources', 'todos']);
    }
}
