"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Edit, Trash2, Globe, FileText, Calendar } from 'lucide-react';
import resources from '@/routes/resources'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';
import { MarkdownContent } from '@/components/ui/markdown-content';

interface Props {
    resource: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        learning_item_id: number | null;
        title: string;
        description: string;
        url: string;
        type: string;
        project?: { id: number; title: string } | null;
        goal?: { id: number; title: string } | null;
        learning_item?: { id: number; title: string } | null;
        user: { name: string };
        created_at: string;
        updated_at: string;
    };
}

export default function ResourcesShow({ resource }: Props) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    const { delete: destroy, processing } = useForm({
        _method: 'delete',
    });

    const handleDelete = () => {
        destroy(resources.destroy(resource.id).url, {
            onSuccess: () => {},
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Resources', href: resources.index().url },
        { title: resource.title, href: resources.show(resource.id).url },
    ];

    (ResourcesShow as typeof ResourcesShow & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={resource.title} />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href={resources.index().url}
                            className="inline-flex items-center gap-2 text-sm text-on-surface-variant hover:text-on-surface text-on-surface-variant hover:text-on-surface"
                        >
                            <ArrowLeft className="size-4" />
                            Back to Resources
                        </Link>
                        <div>
                            <h1 className="text-headline-small text-on-surface">{resource.title}</h1>
                            <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                                {(resource.project ? (
                                    <>
                                        <Link
                                            href={projects.show(resource.project!.id).url}
                                            className="text-primary hover:underline text-primary"
                                        >
                                            {resource.project!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                {(resource.goal ? (
                                    <>
                                        <Link
                                            href={goals.show(resource.goal!.id).url}
                                            className="text-secondary hover:underline text-secondary"
                                        >
                                            {resource.goal!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                {(resource.learning_item ? (
                                    <>
                                        <Link
                                            href={learningItems.show(resource.learning_item!.id).url}
                                            className="text-tertiary hover:underline text-tertiary"
                                        >
                                            {resource.learning_item!.title}
                                        </Link>{' '}
                                        ·
                                    </>
                                ) : null)}
                                Created by {resource.user.name} · {new Date(resource.created_at).toLocaleDateString()}
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <Button
                            variant="outline"
                            as={Link}
                            href={resources.edit(resource.id).url}
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
                            <div>
                                <CardTitle>{resource.title}</CardTitle>
                                <Badge variant="outline" className="mt-1">
                                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                </Badge>
                            </div>
                            <Button
                                size="lg"
                                as={Link}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                <Globe className="size-4 mr-2" />
                                Open Resource
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <MarkdownContent content={resource.description} />
                            <div className="mt-4 p-4 bg-surface rounded-md bg-surface-container-high">
                                <p className="text-sm text-on-surface-variant text-on-surface-variant break-all">
                                    <strong>URL:</strong> {resource.url}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Info</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <dl className="space-y-4 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-on-surface-variant text-on-surface-variant">Created</dt>
                                    <dd className="font-medium">{new Date(resource.created_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-on-surface-variant text-on-surface-variant">Updated</dt>
                                    <dd className="font-medium">{new Date(resource.updated_at).toLocaleDateString()}</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-on-surface-variant text-on-surface-variant">Author</dt>
                                    <dd className="font-medium">{resource.user.name}</dd>
                                </div>
                            </dl>
                        </CardContent>
                    </Card>
                </div>

                <ConfirmDialog
                    isOpen={showDeleteDialog}
                    onClose={() => setShowDeleteDialog(false)}
                    onConfirm={handleDelete}
                    title="Delete Resource"
                    description="Are you sure you want to delete this resource? This action cannot be undone."
                    confirmText="Delete"
                    variant="destructive"
                    isLoading={processing}
                />
            </div>
        </>
    );
}