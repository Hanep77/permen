"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';
import { toDateInputValue } from '@/lib/utils';

interface Props {
    learningItem: {
        id: number;
        goal_id: number | null;
        title: string;
        description: string;
        type: string;
        start_at: string;
        completed_at?: string;
    };
    goals: Array<{ id: number; title: string }>;
}

export default function LearningItemsEdit({ learningItem, goals: goalsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        goal_id: learningItem.goal_id?.toString() || '',
        title: learningItem.title,
        description: learningItem.description,
        type: learningItem.type,
        start_at: toDateInputValue(learningItem.start_at),
        completed_at: toDateInputValue(learningItem.completed_at),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(learningItems.update(learningItem.id).url, {
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

    const goalOptions = [
        { value: '', label: 'No goal' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Items', href: learningItems.index().url },
        { title: learningItem.title, href: learningItems.show(learningItem.id).url },
        { title: 'Edit', href: learningItems.edit(learningItem.id).url },
    ];

    (LearningItemsEdit as typeof LearningItemsEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${learningItem.title}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={learningItems.show(learningItem.id).url}
                        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Learning Item
                    </Link>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Edit Learning Item</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Update your learning item
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Learning Item Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Goal (Optional)"
                                value={data.goal_id}
                                onChange={(e) => setData('goal_id', e.target.value)}
                                options={goalOptions}
                                error={errors.goal_id}
                                placeholder="Link to a goal"
                            />

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter title"
                                maxLength={100}
                                required
                            />

                            <Textarea
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
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

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={learningItems.show(learningItem.id).url}
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