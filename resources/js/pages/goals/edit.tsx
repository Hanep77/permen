"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';
import { toDateInputValue } from '@/lib/utils';

interface Props {
    goal: {
        id: number;
        title: string;
        description: string;
        status: string;
        start_date: string;
        target_date: string;
        completed_at?: string;
    };
}

export default function GoalsEdit({ goal }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        title: goal.title,
        description: goal.description,
        status: goal.status,
        start_date: toDateInputValue(goal.start_date),
        target_date: toDateInputValue(goal.target_date),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(goals.update(goal.id).url, {
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'abandoned', label: 'Abandoned' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Edit', href: goals.edit(goal.id).url },
    ];

    (GoalsEdit as typeof GoalsEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${goal.title}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={goals.show(goal.id).url}
                        className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Goal
                    </Link>
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Edit Goal</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Update your goal details
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Goal Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter goal title"
                                maxLength={100}
                                required
                            />

                            <Textarea
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                error={errors.description}
                                placeholder="Describe your goal in detail"
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

                            <div className="flex justify-end gap-3 pt-4 border-t border-stone-200 dark:border-stone-800">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={goals.show(goal.id).url}
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