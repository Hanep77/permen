"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Calendar, Clock, FileText } from 'lucide-react';
import notes from '@/routes/notes'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

interface Props {
    note: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        title: string;
        content: string;
        project?: { id: number; title: string } | null;
        goal?: { id: number; title: string } | null;
        user: { name: string };
        created_at: string;
        updated_at: string;
    };
}

export default function NotesShow({ note }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(notes.destroy(note.id).url, {
            onSuccess: () => {},
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notes', href: notes.index().url },
        { title: note.title, href: notes.show(note.id).url },
    ];

    (NotesShow as typeof NotesShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={note.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={notes.index().url}
                            className="inline-flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 dark:text-stone-400 dark:hover:text-stone-200"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Notes
                        </Link>
                        <div>
                            <h1 className="text-3xl font-semibold tracking-tight">{note.title}</h1>
                            <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                                {(note.project ? (
                                    <>
                                        <Link
                                            href={projects.show(note.project!.id).url}
                                            className="text-emerald-600 hover:underline dark:text-emerald-400"
                                        >
                                            {note.project!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                {(note.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(note.goal!.id).url}
                                            className="text-blue-600 hover:underline dark:text-blue-400"
                                        >
                                            {note.goal!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                Created by {note.user.name} · {new Date(note.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={notes.edit(note.id).url}
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
                        <CardHeader>
                            <CardTitle>Content</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MarkdownContent content={note.content} />
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
                                    <dd className="font-medium">{new Date(note.created_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400">Updated</dt>
                                    <dd className="font-medium">{new Date(note.updated_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-stone-500 dark:text-stone-400">Author</dt>
                                    <dd className="font-medium">{note.user.name}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Note"
                    description="Are you sure you want to delete this note? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}