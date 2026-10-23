"use client";

import { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Edit, Trash2 } from 'lucide-react';
import projects from '@/routes/projects';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { cn } from '@/lib/utils';

export type ProjectTab = 'overview' | 'notes' | 'resources' | 'todos';

export interface ProjectSummary {
    id: number;
    title: string;
    description: string;
    status: string;
    start_date: string;
    target_date: string;
    completed_at?: string | null;
    created_at: string;
    goal?: { id: number; title: string } | null;
    user: { name: string };
    notes_count: number;
    resources_count: number;
    todos_count: number;
}

interface ProjectLayoutProps {
    project: ProjectSummary;
    activeTab: ProjectTab;
    children: React.ReactNode;
}

const tabs: Array<{
    key: ProjectTab;
    label: string;
    count?: (project: ProjectSummary) => number;
}> = [
    { key: 'overview', label: 'Overview' },
    { key: 'notes', label: 'Notes', count: (project) => project.notes_count },
    {
        key: 'resources',
        label: 'Resources',
        count: (project) => project.resources_count,
    },
    { key: 'todos', label: 'Todos', count: (project) => project.todos_count },
];

function tabHref(tab: ProjectTab, projectId: number): string {
    switch (tab) {
        case 'notes':
            return projects.notes(projectId).url;
        case 'resources':
            return projects.resources(projectId).url;
        case 'todos':
            return projects.todos(projectId).url;
        default:
            return projects.show(projectId).url;
    }
}

export function ProjectLayout({
    project,
    activeTab,
    children,
}: ProjectLayoutProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(projects.destroy(project.id).url);
    };

    const activeTabLabel =
        tabs.find((tab) => tab.key === activeTab)?.label ?? 'Overview';

    return (
        <>
            <Head
                title={
                    activeTab === 'overview'
                        ? project.title
                        : `${project.title} · ${activeTabLabel}`
                }
            />
            <div className="space-y-6">
                <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                        <h1 className="text-headline-small text-on-surface">
                            {project.title}
                        </h1>
                        <p className="mt-1 text-sm text-on-surface-variant">
                            {project.goal ? (
                                <>
                                    <Link
                                        href={goals.show(project.goal.id).url}
                                        className="text-primary hover:underline"
                                    >
                                        {project.goal.title}
                                    </Link>{' '}
                                    ·
                                </>
                            ) : null}
                            Created by {project.user.name} ·{' '}
                            {new Date(project.created_at).toLocaleDateString()}
                        </p>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={projects.edit(project.id).url}
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
                    aria-label="Project sections"
                >
                    <div className="flex min-w-max gap-1">
                        {tabs.map((tab) => {
                            const isActive = tab.key === activeTab;

                            return (
                                <Link
                                    key={tab.key}
                                    href={tabHref(tab.key, project.id)}
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
                                            {tab.count(project)}
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
                    title="Delete Project"
                    description="Are you sure you want to delete this project? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}
