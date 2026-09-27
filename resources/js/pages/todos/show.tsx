"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, Target, Flag, FileText } from 'lucide-react';
import todos from '@/routes/todos'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { TodoStatusToggle } from '@/components/todos/todo-list-item';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

interface Props {
    todo: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        learning_item_id: number | null;
        title: string;
        description: string;
        status: string;
        priority: string;
        due_date: string;
        completed_at?: string;
        project?: { id: number; title: string } | null;
        goal?: { id: number; title: string } | null;
        learning_item?: { id: number; title: string } | null;
        user: { name: string };
        created_at: string;
        updated_at: string;
    };
}

export default function TodosShow({ todo }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [status, setStatus] = useState(todo.status);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(todos.destroy(todo.id).url, {
            onSuccess: () => {},
        });
    };

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'in_progress': return 'default';
            case 'completed': return 'success';
            case 'cancelled': return 'destructive';
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
        { title: 'Todos', href: todos.index().url },
        { title: todo.title, href: todos.show(todo.id).url },
    ];

    (TodosShow as typeof TodosShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={todo.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={todos.index().url}
                            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface text-on-surface-variant hover:text-on-surface"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Todos
                        </Link>
                        <div>
                            <h1 className="text-headline-small text-on-surface">{todo.title}</h1>
                            <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                                {(todo.project ? (
                                    <>
                                        <Link
                                            href={projects.show(todo.project!.id).url}
                                            className="text-primary hover:underline text-primary"
                                        >
                                            {todo.project!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                {(todo.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(todo.goal!.id).url}
                                            className="text-secondary hover:underline text-secondary"
                                        >
                                            {todo.goal!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                {(todo.learning_item ? (
                                    <>
                                        <Link
                                            href={learningItems.show(todo.learning_item!.id).url}
                                            className="text-tertiary hover:underline text-tertiary"
                                        >
                                            {todo.learning_item!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                Created by {todo.user.name} · {new Date(todo.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={todos.edit(todo.id).url}
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
                                <MarkdownContent content={todo.description} />
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
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Current Status</span>
                                        <span className="flex items-center gap-2">
                                            <TodoStatusToggle
                                                todoId={todo.id}
                                                status={status}
                                                onStatusChange={setStatus}
                                                size="sm"
                                            />
                                            <Badge variant={getStatusVariant(status)} className="text-base px-3 py-1">
                                                {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                            </Badge>
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Priority</span>
                                        <Badge variant={getPriorityVariant(todo.priority)}>
                                            {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant text-on-surface-variant">Due Date</span>
                                        <span className="text-sm font-medium">
                                            <Calendar className="size-4 inline mr-1" />
                                            {new Date(todo.due_date).toLocaleDateString()}
                                        </span>
                                    </div>
                                    {todo.completed_at && (
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-on-surface-variant text-on-surface-variant">Completed At</span>
                                            <span className="text-sm font-medium">
                                                <Clock className="size-4 inline mr-1" />
                                                {new Date(todo.completed_at).toLocaleDateString()}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Todo"
                    description="Are you sure you want to delete this todo? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}