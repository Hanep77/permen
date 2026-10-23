"use client";

import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';

export type GoalTab =
    | 'overview'
    | 'projects'
    | 'opportunities'
    | 'notes'
    | 'resources'
    | 'todos'
    | 'learningItems';

export interface GoalSummary {
    id: number;
    title: string;
    description: string;
    status: string;
    start_date: string;
    target_date: string;
    completed_at?: string | null;
    created_at: string;
    user: { name: string };
    projects_count: number;
    opportunities_count: number;
    notes_count: number;
    resources_count: number;
    todos_count: number;
    learning_items_count: number;
}

interface GoalLayoutProps {
    goal: GoalSummary;
    activeTab: GoalTab;
    children: React.ReactNode;
}

const tabs: Array<{
    key: GoalTab;
    label: string;
    count?: (goal: GoalSummary) => number;
}> = [
    { key: 'overview', label: 'Overview' },
    {
        key: 'projects',
        label: 'Projects',
        count: (goal) => goal.projects_count,
    },
    {
        key: 'opportunities',
        label: 'Opportunities',
        count: (goal) => goal.opportunities_count,
    },
    { key: 'notes', label: 'Notes', count: (goal) => goal.notes_count },
    {
        key: 'resources',
        label: 'Resources',
        count: (goal) => goal.resources_count,
    },
    { key: 'todos', label: 'Todos', count: (goal) => goal.todos_count },
    {
        key: 'learningItems',
        label: 'Learning Items',
        count: (goal) => goal.learning_items_count,
    },
];

function tabHref(tab: GoalTab, goalId: number): string {
    switch (tab) {
        case 'projects':
            return goals.projects(goalId).url;
        case 'opportunities':
            return goals.opportunities(goalId).url;
        case 'notes':
            return goals.notes(goalId).url;
        case 'resources':
            return goals.resources(goalId).url;
        case 'todos':
            return goals.todos(goalId).url;
        case 'learningItems':
            return goals.learningItems(goalId).url;
        default:
            return goals.show(goalId).url;
    }
}

export function GoalLayout({ goal, activeTab, children }: GoalLayoutProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(goals.destroy(goal.id).url);
    };

    const activeTabLabel =
        tabs.find((tab) => tab.key === activeTab)?.label ?? 'Overview';

    return (
        <>
            <Head
                title={
                    activeTab === 'overview'
                        ? goal.title
                        : `${goal.title} · ${activeTabLabel}`
                }
            />
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-headline-small text-on-surface">
                            {goal.title}
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            Created by {goal.user.name} ·{' '}
                            {new Date(goal.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={goals.edit(goal.id).url}
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

                <nav
                    className="overflow-x-auto overflow-y-hidden border-b border-outline-variant"
                    aria-label="Goal sections"
                >
                    <div className="flex min-w-max gap-1">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeTab;

                            return (
                                <Link
                                    key={tab.key}
                                    href={tabHref(tab.key, goal.id)}
                                    aria-current={isActive ? 'page' : undefined}
                                    className={cn(
                                        '-mb-px inline-flex items-center gap-2 border-b-2 px-4 py-3 text-label-large transition-colors',
                                        isActive
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-on-surface-variant hover:border-outline-variant hover:text-on-surface',
                                    )}
                                >
                                    {tab.label}
                                    {tab.count && (
                                        <span
                                            className={cn(
                                                'min-w-5 rounded-full px-1.5 py-0.5 text-center text-label-small',
                                                isActive
                                                    ? 'bg-primary-container text-on-primary-container'
                                                    : 'bg-surface-container-high text-on-surface-variant',
                                            )}
                                        >
                                            {tab.count(goal)}
                                        </span>
                                    )}
                                </Link>
                            );
                        })}
                    </div>
                </nav>

                {children}

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Goal"
                    description="Are you sure you want to delete this goal? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}
