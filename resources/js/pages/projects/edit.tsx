"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
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
    project: {
        id: number;
        goal_id: number | null;
        title: string;
        description: string;
        status: string;
        start_date: string;
        target_date: string;
        completed_at?: string;
    };
    goals: Array<{ id: number; title: string }>;
}

export default function ProjectsEdit({ project, goals: goalsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        goal_id: project.goal_id?.toString() || '',
        title: project.title,
        description: project.description,
        status: project.status,
        start_date: toDateInputValue(project.start_date),
        target_date: toDateInputValue(project.target_date),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(projects.update(project.id).url, {
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'abandoned', label: 'Abandoned' },
    ];

    const goalOptions = [
        { value: '', label: 'Select a goal (optional)' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
        { title: project.title, href: projects.show(project.id).url },
        { title: 'Edit', href: projects.edit(project.id).url },
    ];

    (ProjectsEdit as typeof ProjectsEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${project.title}`} />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Edit Project</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Update your project details
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Project Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Goal (Optional)"
                                value={data.goal_id}
                                onChange={(e) => setData('goal_id', e.target.value)}
                                options={goalOptions}
                                placeholder="Link to a goal"
                            />

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter project title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
                                error={errors.description}
                                placeholder="Describe your project in detail"
                                required
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Select
                                    label="Status"
                                    value={data.status}
                                    onChange={(e) => setData('status', e.target.value)}
                                    options={statusOptions}
                                    error={errors.status}
                                    required
                                />

                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={data.start_date}
                                    onChange={(e) => setData('start_date', e.target.value)}
                                    error={errors.start_date}
                                    required
                                />
                            </div>

                            <Input
                                label="Target Date"
                                type="date"
                                value={data.target_date}
                                onChange={(e) => setData('target_date', e.target.value)}
                                error={errors.target_date}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant border-outline-variant">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={projects.show(project.id).url}
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