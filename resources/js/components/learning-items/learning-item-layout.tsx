"use client";

import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';

export type LearningItemTab = 'overview' | 'todos' | 'resources';

export interface LearningItemSummary {
    id: number;
    title: string;
    description: string;
    type: string;
    start_at: string;
    completed_at?: string | null;
    created_at: string;
    goal?: { id: number; title: string } | null;
    user: { name: string };
    todos_count: number;
    resources_count: number;
}

interface LearningItemLayoutProps {
    learningItem: LearningItemSummary;
    activeTab: LearningItemTab;
    children: React.ReactNode;
}

const tabs: Array<{
    key: LearningItemTab;
    label: string;
    count?: (learningItem: LearningItemSummary) => number;
}> = [
    { key: 'overview', label: 'Overview' },
    {
        key: 'todos',
        label: 'Todos',
        count: (learningItem) => learningItem.todos_count,
    },
    {
        key: 'resources',
        label: 'Resources',
        count: (learningItem) => learningItem.resources_count,
    },
];

function tabHref(tab: LearningItemTab, learningItemId: number): string {
    switch (tab) {
        case 'todos':
            return learningItems.todos(learningItemId).url;
        case 'resources':
            return learningItems.resources(learningItemId).url;
        default:
            return learningItems.show(learningItemId).url;
    }
}

export function LearningItemLayout({
    learningItem,
    activeTab,
    children,
}: LearningItemLayoutProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(learningItems.destroy(learningItem.id).url);
    };

    const activeTabLabel =
        tabs.find((tab) => tab.key === activeTab)?.label ?? 'Overview';

    return (
        <>
            <Head
                title={
                    activeTab === 'overview'
                        ? learningItem.title
                        : `${learningItem.title} · ${activeTabLabel}`
                }
            />
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-headline-small text-on-surface">
                            {learningItem.title}
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            {learningItem.goal ? (
                                <>
                                    <Link
                                        href={goals.show(learningItem.goal.id).url}
                                        className="text-primary hover:underline"
                                    >
                                        {learningItem.goal.title}
                                    </Link>{' '}
                                    ·
                                </>
                            ) : null}
                            Created by {learningItem.user.name} ·{' '}
                            {new Date(
                                learningItem.created_at,
                            ).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={learningItems.edit(learningItem.id).url}
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
                    aria-label="Learning item sections"
                >
                    <div className="flex min-w-max gap-1">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeTab;

                            return (
                                <Link
                                    key={tab.key}
                                    href={tabHref(tab.key, learningItem.id)}
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
                                            {tab.count(learningItem)}
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
                    title="Delete Learning Item"
                    description="Are you sure you want to delete this learning item? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}
