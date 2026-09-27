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
import { toDateInputValue } from '@/lib/utils';

interface Props {
    opportunity: {
        id: number;
        goal_id: number | null;
        title: string;
        description: string;
        status: string;
        source: string;
        priority: string;
        estimated_value: string;
        next_action: string;
        due_date: string;
    };
    goals: Array<{ id: number; title: string }>;
}

export default function OpportunitiesEdit({ opportunity, goals: goalsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        goal_id: opportunity.goal_id?.toString() || '',
        title: opportunity.title,
        description: opportunity.description,
        status: opportunity.status,
        source: opportunity.source,
        priority: opportunity.priority,
        estimated_value: opportunity.estimated_value,
        next_action: opportunity.next_action,
        due_date: toDateInputValue(opportunity.due_date),
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(opportunities.update(opportunity.id).url, {
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

    const goalOptions = [
        { value: '', label: 'Select a goal (optional)' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Opportunities', href: opportunities.index().url },
        { title: opportunity.title, href: opportunities.show(opportunity.id).url },
        { title: 'Edit', href: opportunities.edit(opportunity.id).url },
    ];

    (OpportunitiesEdit as typeof OpportunitiesEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${opportunity.title}`} />
            <div className="space-y-6">
                <div className="flex items-center gap-4">
                    <Link
                        href={opportunities.show(opportunity.id).url}
                        className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface text-on-surface-variant hover:text-on-surface"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Opportunity
                    </Link>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Edit Opportunity</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Update your opportunity details
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Opportunity Details</CardTitle>
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
                                    href={opportunities.show(opportunity.id).url}
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