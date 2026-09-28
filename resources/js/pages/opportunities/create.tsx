"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import opportunities from '@/routes/opportunities'
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
    goals: Array<{ id: number; title: string }>;
    preset: {
        goal: ParentPreset | null;
    };
}

export default function OpportunitiesCreate({ preset }: Props) {
    const presetGoal = preset.goal;
    const context = presetGoal ? 'goal' : 'independent';

    const backHref = presetGoal ? goals.show(presetGoal.id).url : opportunities.index().url;

    const { data, setData, post, processing, errors } = useForm({
        goal_id: presetGoal ? presetGoal.id.toString() : '',
        context: context,
        title: '',
        description: '',
        status: 'new',
        source: '',
        priority: 'medium',
        estimated_value: 'medium',
        next_action: '',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(opportunities.store().url, {
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: 'new', label: 'New' },
        { value: 'considering', label: 'Considering' },
        { value: 'persuing', label: 'Pursuing' },
        { value: 'won', label: 'Won' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' },
    ];

    const priorityOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const estimatedValueOptions = [
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        presetGoal
            ? { title: presetGoal.title, href: goals.show(presetGoal.id).url }
            : { title: 'Opportunities', href: opportunities.index().url },
        { title: 'Create', href: opportunities.create().url },
    ];

    (OpportunitiesCreate as typeof OpportunitiesCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Opportunity" />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Create Opportunity</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Track a new potential opportunity
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Opportunity Details</CardTitle>
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
                                placeholder="Enter opportunity title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Description"
                                value={data.description}
                                onChange={(v) => setData('description', v)}
                                error={errors.description}
                                placeholder="Describe the opportunity"
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
                                    label="Source"
                                    value={data.source}
                                    onChange={(e) => setData('source', e.target.value)}
                                    error={errors.source}
                                    placeholder="Where did this come from?"
                                    required
                                />
                            </div>

                            <div className="grid gap-4 sm:grid-cols-3">
                                <Select
                                    label="Priority"
                                    value={data.priority}
                                    onChange={(e) => setData('priority', e.target.value)}
                                    options={priorityOptions}
                                    error={errors.priority}
                                    required
                                />

                                <Select
                                    label="Estimated Value"
                                    value={data.estimated_value}
                                    onChange={(e) => setData('estimated_value', e.target.value)}
                                    options={estimatedValueOptions}
                                    error={errors.estimated_value}
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

                            <MarkdownEditor
                                label="Next Action"
                                value={data.next_action}
                                onChange={(v) => setData('next_action', v)}
                                error={errors.next_action}
                                placeholder="What's the next step?"
                                required
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
                                    {processing ? 'Creating...' : 'Create Opportunity'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}