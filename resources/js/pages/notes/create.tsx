"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import notes from '@/routes/notes'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

interface ParentPreset {
    id: number;
    title: string;
}

interface Props {
    projects: Array<{ id: number; title: string }>;
    goals: Array<{ id: number; title: string }>;
    preset: {
        project: ParentPreset | null;
        goal: ParentPreset | null;
    };
}

export default function NotesCreate({ projects: projectsList, goals: goalsList, preset }: Props) {
    const presetProject = preset.project;
    const presetGoal = preset.goal;
    const context = presetProject ? 'project' : presetGoal ? 'goal' : 'independent';

    const backHref = presetProject
        ? projects.show(presetProject.id).url
        : presetGoal
          ? goals.show(presetGoal.id).url
          : notes.index().url;

    const backLabel = presetProject
        ? `Back to ${presetProject.title}`
        : presetGoal
          ? `Back to ${presetGoal.title}`
          : 'Back to Notes';

    const { data, setData, post, processing, errors } = useForm({
        project_id: presetProject ? presetProject.id.toString() : '',
        goal_id: presetGoal ? presetGoal.id.toString() : '',
        context: context,
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(notes.store().url, {
            onSuccess: () => {},
        });
    };

    const projectOptions = [
        { value: '', label: 'Select a project (optional)' },
        ...projectsList.map((p) => ({ value: p.id.toString(), label: p.title })),
    ];

    const goalOptions = [
        { value: '', label: 'Select a goal (optional)' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        presetProject
            ? { title: presetProject.title, href: projects.show(presetProject.id).url }
            : presetGoal
              ? { title: presetGoal.title, href: goals.show(presetGoal.id).url }
              : { title: 'Notes', href: notes.index().url },
        { title: 'Create', href: notes.create().url },
    ];

    (NotesCreate as typeof NotesCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Note" />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={backHref}
                        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                    >
                        <ArrowLeft className="size-4" />
                        {backLabel}
                    </Link>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Create Note</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Write a new note
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Note Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {presetProject ? (
                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
                                    <span className="text-stone-500 dark:text-stone-400">Project:</span>
                                    <Link
                                        href={projects.show(presetProject.id).url}
                                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        {presetProject.title}
                                    </Link>
                                </div>
                            ) : (
                                presetGoal && (
                                    <Select
                                        label="Project (Optional)"
                                        value={data.project_id}
                                        onChange={(e) => setData('project_id', e.target.value)}
                                        options={projectOptions}
                                        placeholder="Link to a project"
                                    />
                                )
                            )}

                            {presetGoal ? (
                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
                                    <span className="text-stone-500 dark:text-stone-400">Goal:</span>
                                    <Link
                                        href={goals.show(presetGoal.id).url}
                                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        {presetGoal.title}
                                    </Link>
                                </div>
                            ) : (
                                presetProject && (
                                    <Select
                                        label="Goal (Optional)"
                                        value={data.goal_id}
                                        onChange={(e) => setData('goal_id', e.target.value)}
                                        options={goalOptions}
                                        placeholder="Link to a goal"
                                    />
                                )
                            )}

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter note title"
                                maxLength={100}
                                required
                            />

                            <Textarea
                                label="Content"
                                value={data.content}
                                onChange={(e) => setData('content', e.target.value)}
                                error={errors.content}
                                placeholder="Write your note content here..."
                                className="min-h-[200px]"
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={backHref}
                                >
                                    <ArrowLeft className="size-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    {processing ? 'Creating...' : 'Create Note'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}