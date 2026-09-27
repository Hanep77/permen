"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import todos from '@/routes/todos'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

interface ParentPreset {
    id: number;
    title: string;
}

interface Props {
    preset: {
        project: ParentPreset | null;
        goal: ParentPreset | null;
        learningItem: ParentPreset | null;
    };
}

export default function TodosCreate({ preset }: Props) {
    const presetProject = preset.project;
    const presetGoal = preset.goal;
    const presetLearningItem = preset.learningItem;
    const context = presetProject ? 'project' : presetGoal ? 'goal' : presetLearningItem ? 'learning_item' : 'independent';

    const backHref = presetProject
        ? projects.show(presetProject.id).url
        : presetGoal
          ? goals.show(presetGoal.id).url
          : presetLearningItem
            ? learningItems.show(presetLearningItem.id).url
            : todos.index().url;

    const backLabel = presetProject
        ? `Back to ${presetProject.title}`
        : presetGoal
          ? `Back to ${presetGoal.title}`
          : presetLearningItem
            ? `Back to ${presetLearningItem.title}`
            : 'Back to Todos';

    const { data, setData, post, processing, errors } = useForm({
        project_id: presetProject ? presetProject.id.toString() : '',
        goal_id: presetGoal ? presetGoal.id.toString() : '',
        learning_item_id: presetLearningItem ? presetLearningItem.id.toString() : '',
        context: context,
        title: '',
        description: '',
        status: 'todo',
        priority: 'medium',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(todos.store().url, {
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        presetProject
            ? { title: presetProject.title, href: projects.show(presetProject.id).url }
            : presetGoal
              ? { title: presetGoal.title, href: goals.show(presetGoal.id).url }
              : presetLearningItem
                ? { title: presetLearningItem.title, href: learningItems.show(presetLearningItem.id).url }
                : { title: 'Todos', href: todos.index().url },
        { title: 'Create', href: todos.create().url },
    ];

    (TodosCreate as typeof TodosCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Todo" />
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
                        <h1 className="text-3xl font-semibold tracking-tight">Create Todo</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Add a new task to your list
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todo Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {presetProject && (
                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
                                    <span className="text-stone-500 dark:text-stone-400">Project:</span>
                                    <Link
                                        href={projects.show(presetProject.id).url}
                                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        {presetProject.title}
                                    </Link>
                                </div>
                            )}

                            {presetGoal && (
                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
                                    <span className="text-stone-500 dark:text-stone-400">Goal:</span>
                                    <Link
                                        href={goals.show(presetGoal.id).url}
                                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        {presetGoal.title}
                                    </Link>
                                </div>
                            )}

                            {presetLearningItem && (
                                <div className="flex items-center gap-2 rounded-lg border border-stone-200 bg-stone-50 px-4 py-3 text-sm dark:border-stone-800 dark:bg-stone-900">
                                    <span className="text-stone-500 dark:text-stone-400">Learning Item:</span>
                                    <Link
                                        href={learningItems.show(presetLearningItem.id).url}
                                        className="font-medium text-emerald-600 hover:underline dark:text-emerald-400"
                                    >
                                        {presetLearningItem.title}
                                    </Link>
                                </div>
                            )}

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter todo title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
                                error={errors.description}
                                placeholder="Describe the task"
                                required
                            />

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Select
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    options={statusOptions}
                                    error={errors.status}
                                    required
                                />

                                <Select
                                    label="Priority"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    options={priorityOptions}
                                    error={errors.priority}
                                    required
                                />

                                <Input
                                    label="Due Date"
                                    type="date"
                                    value={data.due_date}
                                    onChange={(e) => setData('due_date', e.target.value)}
                                    error={errors.due_date}
                                    required
                                />
                            </div>

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
                                    {processing ? 'Creating...' : 'Create Todo'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}