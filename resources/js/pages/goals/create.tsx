"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

export default function GoalsCreate() {
    const { data, setData, post, processing, errors } = useForm({
        title: '',
        description: '',
        status: 'draft',
        start_date: new Date().toISOString().split('T')[0],
        target_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(goals.store().url, {
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
        { title: 'Create', href: goals.create().url },
    ];

    (GoalsCreate as typeof GoalsCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Goal" />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Create Goal</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Define a new long-term objective
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

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
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

                            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant border-outline-variant">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={goals.index().url}
                                >
                                    <ArrowLeft className="size-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    {processing ? 'Creating...' : 'Create Goal'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}