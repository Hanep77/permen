"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Target, Clock, Plus } from 'lucide-react';
import projects from '@/routes/projects'
import notes from '@/routes/notes'
import resources from '@/routes/resources'
import todos from '@/routes/todos'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

interface Props {
    project: {
        id: number;
        goal_id: number | null;
        title: string;
        description: string;
        status: string;
        start_date: string;
        target_date: string;
        completed_at?: string;
        goal?: { id: number; title: string } | null;
        notes: Array<{ id: number; title: string }>;
        resources: Array<{ id: number; title: string }>;
        todos: Array<{ id: number; title: string; status: string }>;
        user: { name: string };
        created_at: string;
        updated_at: string;
    };
}

export default function ProjectsShow({ project }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(projects.destroy(project.id).url, {
            onSuccess: () => {},
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'completed': return 'success';
            case 'abandoned': return 'destructive';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
        { title: project.title, href: projects.show(project.id).url },
    ];

    (ProjectsShow as typeof ProjectsShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={project.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={projects.index().url}
                            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Projects
                        </Link>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">{project.title}</h1>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                {project.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(project.goal.id).url}
                                            className="text-emerald-600 hover:underline dark:text-emerald-400"
                                        >
                                            {project.goal.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null}
                                Created by {project.user.name} · {new Date(project.created_at).toLocaleDateString()}
                            </p>
                        </div>
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

                <div className="grid gap-6 lg:grid-cols-3">
                    <div className="lg:col-span-2 space-y-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Description</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <MarkdownContent content={project.description} />
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Notes</CardTitle>
                                    <CardDescription>
                                        {project.notes.length} note{project.notes.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={notes.create.url({ query: { project_id: project.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Note
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {project.notes.length === 0 ? (
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        No notes yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {project.notes.map((note) => (
                                            <Link
                                                key={note.id}
                                                href={notes.show(note.id).url}
                                                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                            >
                                                <p className="font-medium text-stone-900 dark:text-stone-100">
                                                    {note.title}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Resources</CardTitle>
                                    <CardDescription>
                                        {project.resources.length} resource{project.resources.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={resources.create.url({ query: { project_id: project.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Resource
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {project.resources.length === 0 ? (
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        No resources yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {project.resources.map((resource) => (
                                            <Link
                                                key={resource.id}
                                                href={resources.show(resource.id).url}
                                                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                            >
                                                <p className="font-medium text-stone-900 dark:text-stone-100">
                                                    {resource.title}
                                                </p>
                                            </Link>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader className="flex flex-row items-center justify-between">
                                <div>
                                    <CardTitle>Todos</CardTitle>
                                    <CardDescription>
                                        {project.todos.length} todo{project.todos.length !== 1 ? 's' : ''}
                                    </CardDescription>
                                </div>
                                <Button
                                    size="sm"
                                    as={Link}
                                    href={todos.create.url({ query: { project_id: project.id } })}
                                >
                                    <Plus className="size-4" />
                                    Add Todo
                                </Button>
                            </CardHeader>
                            <CardContent>
                                {project.todos.length === 0 ? (
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        No todos yet.
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {project.todos.map((todo) => (
                                            <Link
                                                key={todo.id}
                                                href={todos.show(todo.id).url}
                                                className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                            >
                                                <div>
                                                    <p className="font-medium text-stone-900 dark:text-stone-100">
                                                        {todo.title}
                                                    </p>
                                                    <Badge variant={getStatusVariant(todo.status)}>
                                                        {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                                    </Badge>
                                                </div>
                                            </Link>
                                        ))}
                                    </div>
                                )}
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
                                        <Badge variant={getStatusVariant(project.status)} className="text-base px-3 py-1">
                                            {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Start Date</span>
                                        <span className="text-sm font-medium">
                                            <Calendar className="size-4 inline mr-1" />
                                            {new Date(project.start_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-stone-500 dark:text-stone-400">Target Date</span>
                                        <span className="text-sm font-medium">
                                            <Target className="size-4 inline mr-1" />
                                            {new Date(project.target_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {project.completed_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-stone-500 dark:text-stone-400">Completed At</span>
                                            <span className="text-sm font-medium">
                                                <Clock className="size-4 inline mr-1" />
                                                {new Date(project.completed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <Button
                                    as={Link}
                                    href={notes.create.url({ query: { project_id: project.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Note
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={resources.create.url({ query: { project_id: project.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Resource
                                </Button>
                                <Button
                                    variant="outline"
                                    as={Link}
                                    href={todos.create.url({ query: { project_id: project.id } })}
                                    className="w-full justify-start"
                                >
                                    <Plus className="size-4" />
                                    Add Todo
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>

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