"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, BookOpen, GraduationCap, Play, FileText, Book, CheckCircle2, Plus } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import goals from '@/routes/goals';
import resources from '@/routes/resources';
import todos from '@/routes/todos';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface Props {
    learningItem: {
        id: number;
        title: string;
        description: string;
        type: string;
        start_at: string;
        completed_at?: string;
        user: { name: string };
        goal: { id: number; title: string } | null;
        todos: Array<{ id: number; title: string; status: string }>;
        resources: Array<{ id: number; title: string; type: string }>;
        created_at: string;
        updated_at: string;
    };
}

export default function LearningItemsShow({ learningItem }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(learningItems.destroy(learningItem.id).url, {
            onSuccess: () => {},
        });
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'book': return <Book className="size-5" />;
            case 'course': return <GraduationCap className="size-5" />;
            case 'video': return <Play className="size-5" />;
            case 'paper': return <FileText className="size-5" />;
            default: return <BookOpen className="size-5" />;
        }
    };

    const getTodoStatusVariant = (status: string) => {
        switch (status) {
            case 'in_progress': return 'default';
            case 'completed': return 'success';
            case 'cancelled': return 'destructive';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Items', href: learningItems.index().url },
        { title: learningItem.title, href: learningItems.show(learningItem.id).url },
    ];

    (LearningItemsShow as typeof LearningItemsShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={learningItem.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={learningItems.index().url}
                            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Learning Items
                        </Link>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">{learningItem.title}</h1>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                {learningItem.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(learningItem.goal.id).url}
                                            className="text-emerald-600 hover:underline dark:text-emerald-400"
                                        >
                                            {learningItem.goal.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null}
                                Created by {learningItem.user.name} · {new Date(learningItem.created_at).toLocaleDateString()}
                            </p>
                        </div>
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

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-start justify-between">
                            <div className="flex items-center gap-4">
                                <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                                    {getTypeIcon(learningItem.type)}
                                </div>
                                <div>
                                    <CardTitle>{learningItem.title}</CardTitle>
                                    <Badge variant={learningItem.completed_at ? 'success' : 'default'} className="mt-1">
                                        {learningItem.completed_at ? 'Completed' : 'In Progress'}
                                    </Badge>
                                </div>
                            </div>
                            {learningItem.completed_at && (
                                <CheckCircle2 className="size-8 text-green-500" />
                            )}
                        </CardHeader>
                        <CardContent>
                            <div className="prose prose-stone dark:prose-invert max-w-none">
                                <p className="whitespace-pre-wrap">{learningItem.description}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Todos</CardTitle>
                                <CardDescription>
                                    {learningItem.todos.length} todo{learningItem.todos.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                as={Link}
                                href={todos.create.url({ query: { learning_item_id: learningItem.id } })}
                            >
                                <Plus className="size-4" />
                                Add Todo
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {learningItem.todos.length === 0 ? (
                                <p className="text-sm text-stone-500 dark:text-stone-400">
                                    No todos yet. Create a todo to track steps for this learning item.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {learningItem.todos.map((todo) => (
                                        <Link
                                            key={todo.id}
                                            href={todos.show(todo.id).url}
                                            className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                        >
                                            <div>
                                                <p className="font-medium text-stone-900 dark:text-stone-100">
                                                    {todo.title}
                                                </p>
                                                <Badge variant={getTodoStatusVariant(todo.status)}>
                                                    {todo.status.charAt(0).toUpperCase() + todo.status.slice(1)}
                                                </Badge>
                                            </div>
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
                                    {learningItem.resources.length} resource{learningItem.resources.length !== 1 ? 's' : ''}
                                </CardDescription>
                            </div>
                            <Button
                                size="sm"
                                as={Link}
                                href={resources.create.url({ query: { learning_item_id: learningItem.id } })}
                            >
                                <Plus className="size-4" />
                                Add Resource
                            </Button>
                        </CardHeader>
                        <CardContent>
                            {learningItem.resources.length === 0 ? (
                                <p className="text-sm text-stone-500 dark:text-stone-400">
                                    No resources yet. Save a resource to reference for this learning item.
                                </p>
                            ) : (
                                <div className="space-y-3">
                                    {learningItem.resources.map((resource) => (
                                        <Link
                                            key={resource.id}
                                            href={resources.show(resource.id).url}
                                            className="flex items-center justify-between p-3 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                        >
                                            <div>
                                                <p className="font-medium text-stone-900 dark:text-stone-100">
                                                    {resource.title}
                                                </p>
                                                <p className="text-sm text-stone-500 dark:text-stone-400 capitalize">
                                                    {resource.type}
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Progress</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4 text-sm">
                                <div className="flex items-center justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                        <BookOpen className="size-4" /> Type
                                    </dt>
                                    <dd className="font-medium capitalize">{learningItem.type}</dd>
                                </div>
                                <div className="flex items-center justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                        <Calendar className="size-4" /> Started
                                    </dt>
                                    <dd className="font-medium">{new Date(learningItem.start_at).toLocaleDateString()}</dd>
                                </div>
                                {learningItem.completed_at && (
                                    <div className="flex items-center justify-between">
                                        <dt className="text-stone-500 dark:text-stone-400 flex items-center gap-2">
                                            <CheckCircle2 className="size-4" /> Completed
                                        </dt>
                                        <dd className="font-medium">{new Date(learningItem.completed_at).toLocaleDateString()}</dd>
                                    </div>
                                )}
                            </dl>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400">Created</dt>
                                    <dd className="font-medium">{new Date(learningItem.created_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400">Updated</dt>
                                    <dd className="font-medium">{new Date(learningItem.updated_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400">Author</dt>
                                    <dd className="font-medium">{learningItem.user.name}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

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