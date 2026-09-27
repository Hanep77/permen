"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Target, DollarSign, Flag, FileText } from 'lucide-react';
import opportunities from '@/routes/opportunities'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

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
        goal?: { id: number; title: string } | null;
        user: { name: string };
        created_at: string;
        updated_at: string;
    };
}

export default function OpportunitiesShow({ opportunity }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(opportunities.destroy(opportunity.id).url, {
            onSuccess: () => {},
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'won': return 'success';
            case 'persuing': return 'default';
            case 'considering': return 'warning';
            case 'rejected':
            case 'expired': return 'destructive';
            default: return 'secondary';
        }
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Opportunities', href: opportunities.index().url },
        { title: opportunity.title, href: opportunities.show(opportunity.id).url },
    ];

    (OpportunitiesShow as typeof OpportunitiesShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={opportunity.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={opportunities.index().url}
                            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Opportunities
                        </Link>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">{opportunity.title}</h1>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                {opportunity.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(opportunity.goal!.id).url}
                                            className="text-emerald-600 hover:underline dark:text-emerald-400"
                                        >
                                            {opportunity.goal!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null}
                                Created by {opportunity.user.name} · {new Date(opportunity.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={opportunities.edit(opportunity.id).url}
                        >
                            <Edit className="size-4" />
                            Edit
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            <Trash2 className="size-4" />
                        </Button>
                    </div>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MarkdownContent content={opportunity.description} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Next Action</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex items-start gap-3">
                                    <FileText className="size-5 text-stone-400 mt-0.5 shrink-0" />
                                    <MarkdownContent content={opportunity.next_action} />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Status</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Current Status</span>
                                        <Badge variant={getStatusVariant(opportunity.status)} className="text-base px-3 py-1">
                                            {opportunity.status.charAt(0).toUpperCase() + opportunity.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Source</span>
                                        <span className="text-sm font-medium">{opportunity.source}</span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Priority</span>
                                        <Badge variant={getPriorityVariant(opportunity.priority)}>
                                            {opportunity.priority.charAt(0).toUpperCase() + opportunity.priority.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Estimated Value</span>
                                        <Badge variant="outline">
                                            {opportunity.estimated_value.charAt(0).toUpperCase() + opportunity.estimated_value.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Due Date</span>
                                        <span className="text-sm font-medium">
                                            <Calendar className="size-4 inline mr-1" />
                                            {new Date(opportunity.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Opportunity"
                    description="Are you sure you want to delete this opportunity? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}