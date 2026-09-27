"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import resources from '@/routes/resources'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    resource: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        learning_item_id: number | null;
        title: string;
        description: string;
        url: string;
        type: string;
    };
    projects: Array<{ id: number; title: string }>;
    goals: Array<{ id: number; title: string }>;
    learningItems: Array<{ id: number; title: string }>;
}

export default function ResourcesEdit({ resource, projects: projectsList, goals: goalsList, learningItems: learningItemsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: resource.project_id?.toString() || '',
        goal_id: resource.goal_id?.toString() || '',
        learning_item_id: resource.learning_item_id?.toString() || '',
        title: resource.title,
        description: resource.description,
        url: resource.url,
        type: resource.type,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(resources.update(resource.id).url, {
            onSuccess: () => {},
        });
    };

    const typeOptions = [
        { value: 'book', label: 'Book' },
        { value: 'course', label: 'Course' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'paper', label: 'Paper' },
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'documentation', label: 'Documentation' },
        { value: 'website', label: 'Website' },
        { value: 'other', label: 'Other' },
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
        { title: 'Resources', href: resources.index().url },
        { title: resource.title, href: resources.show(resource.id).url },
        { title: 'Edit', href: resources.edit(resource.id).url },
    ];

    (ResourcesEdit as typeof ResourcesEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${resource.title}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={resources.show(resource.id).url}
                        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Resource
                    </Link>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Edit Resource</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Update your resource
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Resource Details</CardTitle>
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
                                error={errors.learning_item_id}
                                placeholder="Link to a learning item"
                            />

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter resource title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
                                error={errors.description}
                                placeholder="Describe the resource"
                                required
                            />

                            <Input
                                label="URL"
                                type="url"
                                value={data.url}
                                onChange={(e) => setData('url', e.target.value)}
                                error={errors.url}
                                placeholder="https://example.com"
                                required
                            />

                            <Select
                                label="Type"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                                options={typeOptions}
                                error={errors.type}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={resources.show(resource.id).url}
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