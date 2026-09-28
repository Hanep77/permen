"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import todos from '@/routes/todos'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';
import { toDateInputValue } from '@/lib/utils';

interface Props {
    todo: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        learning_item_id: number | null;
        title: string;
        description: string;
        status: string;
        priority: string;
        due_date: string;
    };
    projects: Array<{ id: number; title: string }>;
    goals: Array<{ id: number; title: string }>;
    learningItems: Array<{ id: number; title: string }>;
}

export default function TodosEdit({ todo, projects: projectsList, goals: goalsList, learningItems: learningItemsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: todo.project_id?.toString() || '',
        goal_id: todo.goal_id?.toString() || '',
        learning_item_id: todo.learning_item_id?.toString() || '',
        title: todo.title,
        description: todo.description,
        status: todo.status,
        priority: todo.priority,
        due_date: toDateInputValue(todo.due_date),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(todos.update(todo.id).url, {
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

    const projectOptions = [
        { value: '', label: 'Select a project (optional)' },
        ...projectsList.map((p) => ({ value: p.id.toString(), label: p.title })),
    ];

    const goalOptions = [
        { value: '', label: 'Select a goal (optional)' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const learningItemOptions = [
        { value: '', label: 'Select a learning item (optional)' },
        ...learningItemsList.map((l) => ({ value: l.id.toString(), label: l.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Todos', href: todos.index().url },
        { title: todo.title, href: todos.show(todo.id).url },
        { title: 'Edit', href: todos.edit(todo.id).url },
    ];

    (TodosEdit as typeof TodosEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${todo.title}`} />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Edit Todo</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Update your task details
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Todo Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Project (Optional)"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                                options={projectOptions}
                                placeholder="Link to a project"
                            />

                            <Select
                                label="Goal (Optional)"
                                value={data.goal_id}
                                onChange={(e) => setData('goal_id', e.target.value)}
                                options={goalOptions}
                                placeholder="Link to a goal"
                            />

                            <Select
                                label="Learning Item (Optional)"
                                value={data.learning_item_id}
                                onChange={(e) => setData('learning_item_id', e.target.value)}
                                options={learningItemOptions}
                                placeholder="Link to a learning item"
                            />

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

                            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant border-outline-variant">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={todos.show(todo.id).url}
                                >
                                    <ArrowLeft className="size-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}