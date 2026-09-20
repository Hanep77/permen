<?php

namespace App\Http\Controllers;

use App\Http\Requests\Note\StoreNoteRequest;
use App\Http\Requests\Note\UpdateNoteRequest;
use App\Models\Goal;
use App\Models\Note;
use App\Models\Project;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;

class NoteController extends Controller
{
    public function index(): Response
    {
        $notes = Note::with(['project', 'goal', 'user'])
            ->where('user_id', request()->user()->id)
            ->when(request()->query('scope') !== 'all', function ($query) {
                $query->whereNull('project_id')->whereNull('goal_id');
            })
            ->latest()
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('notes/index', [
            'notes' => $notes,
            'filters' => request()->only(['project_id', 'goal_id', 'search', 'scope']),
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

        return Inertia::render('notes/create', [
            'projects' => $projects,
            'goals' => $goals,
            'preset' => [
                'project' => $project,
                'goal' => $goal,
            ],
        ]);
    }

    public function store(StoreNoteRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $context = $validated['context'] ?? 'independent';
        unset($validated['context']);

        if ($context === 'independent') {
            $validated['project_id'] = null;
            $validated['goal_id'] = null;
        }

        $note = Note::create([
            ...$validated,
            'user_id' => $request->user()->id,
        ]);

        $parentTargets = [
            'project' => $note->project_id ? ['projects.show', $note->project_id] : null,
            'goal' => $note->goal_id ? ['goals.show', $note->goal_id] : null,
        ];

        foreach (array_unique([$context, 'project', 'goal']) as $key) {
            if (! empty($parentTargets[$key])) {
                return redirect()->route(...$parentTargets[$key])
                    ->with('success', 'Note created successfully.');
            }
        }

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note created successfully.');
    }

    public function show(Note $note): Response
    {
        $this->authorize('view', $note);

        $note->load(['project', 'goal', 'user']);

        return Inertia::render('notes/show', [
            'note' => $note,
        ]);
    }

    public function edit(Note $note): Response
    {
        $this->authorize('update', $note);

        $projects = Project::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        $goals = Goal::where('user_id', request()->user()->id)
            ->get(['id', 'title']);

        return Inertia::render('notes/edit', [
            'note' => $note,
            'projects' => $projects,
            'goals' => $goals,
        ]);
    }

    public function update(UpdateNoteRequest $request, Note $note): RedirectResponse
    {
        $this->authorize('update', $note);

        $note->update($request->validated());

        return redirect()->route('notes.show', $note)
            ->with('success', 'Note updated successfully.');
    }

    public function destroy(Note $note): RedirectResponse
    {
        $this->authorize('delete', $note);

        $note->delete();

        return redirect()->route('notes.index')
            ->with('success', 'Note deleted successfully.');
    }
}
