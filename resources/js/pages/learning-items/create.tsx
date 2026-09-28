"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import goals from '@/routes/goals';
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
        goal: ParentPreset | null;
    };
}

export default function LearningItemsCreate({ preset }: Props) {
    const presetGoal = preset.goal;
    const context = presetGoal ? 'goal' : 'independent';

    const backHref = presetGoal ? goals.show(presetGoal.id).url : learningItems.index().url;

    const { data, setData, post, processing, errors } = useForm({
        goal_id: presetGoal ? presetGoal.id.toString() : '',
        context: context,
        title: '',
        description: '',
        type: 'article',
        start_at: new Date().toISOString().split('T')[0],
        completed_at: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(learningItems.store().url, {
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

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        presetGoal
            ? { title: presetGoal.title, href: goals.show(presetGoal.id).url }
            : { title: 'Learning Items', href: learningItems.index().url },
        { title: 'Create', href: learningItems.create().url },
    ];

    (LearningItemsCreate as typeof LearningItemsCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Learning Item" />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Create Learning Item</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Track something new you're learning
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Learning Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {presetGoal && (
                                <div className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm border-outline-variant bg-surface-container-low">
                                    <span className="text-on-surface-variant text-on-surface-variant">Goal:</span>
                                    <Link
                                        href={goals.show(presetGoal.id).url}
                                        className="font-medium text-primary hover:underline text-primary"
                                    >
                                        {presetGoal.title}
                                    </Link>
                                </div>
                            )}

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
                                error={errors.description}
                                placeholder="Describe what you're learning"
                                required
                            />

                            <div className="grid gap-4 sm:grid-cols-2">
                                <Select
                                    label="Type"
                                    value={data.type}
                                    onChange={(e) => setData('type', e.target.value)}
                                    options={typeOptions}
                                    error={errors.type}
                                    required
                                />

                                <Input
                                    label="Start Date"
                                    type="date"
                                    value={data.start_at}
                                    onChange={(e) => setData('start_at', e.target.value)}
                                    error={errors.start_at}
                                    required
                                />
                            </div>

                            <Input
                                label="Completed Date (Optional)"
                                type="date"
                                value={data.completed_at}
                                onChange={(e) => setData('completed_at', e.target.value)}
                                error={errors.completed_at}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant border-outline-variant">
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
                                    {processing ? 'Creating...' : 'Create Learning Item'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}