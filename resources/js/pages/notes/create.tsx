"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import notes from '@/routes/notes'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

interface ParentPreset {
    id: number;
    title: string;
}

interface Props {
    preset: {
        project: ParentPreset | null;
        goal: ParentPreset | null;
    };
}

export default function NotesCreate({ preset }: Props) {
    const presetProject = preset.project;
    const presetGoal = preset.goal;
    const context = presetProject ? 'project' : presetGoal ? 'goal' : 'independent';

    const backHref = presetProject
        ? projects.show(presetProject.id).url
        : presetGoal
          ? goals.show(presetGoal.id).url
          : notes.index().url;

    const { data, setData, post, processing, errors } = useForm({
        project_id: presetProject ? presetProject.id.toString() : '',
        goal_id: presetGoal ? presetGoal.id.toString() : '',
        context: context,
        title: '',
        content: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(notes.store().url, {
            onSuccess: () => {},
        });
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        presetProject
            ? { title: presetProject.title, href: projects.show(presetProject.id).url }
            : presetGoal
              ? { title: presetGoal.title, href: goals.show(presetGoal.id).url }
              : { title: 'Notes', href: notes.index().url },
        { title: 'Create', href: notes.create().url },
    ];

    (NotesCreate as typeof NotesCreate & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Create Note" />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Create Note</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Write a new note
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Note Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {presetProject && (
                                <div className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm border-outline-variant bg-surface-container-low">
                                    <span className="text-on-surface-variant text-on-surface-variant">Project:</span>
                                    <Link
                                        href={projects.show(presetProject.id).url}
                                        className="font-medium text-primary hover:underline text-primary"
                                    >
                                        {presetProject.title}
                                    </Link>
                                </div>
                            )}

                            {presetGoal && (
                                <div className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-4 py-3 text-sm border-outline-variant bg-surface-container-low">
                                    <span className="text-on-surface-variant text-on-surface-variant">Goal:</span>
                                    <Link
                                        href={goals.show(presetGoal.id).url}
                                        className="font-medium text-primary hover:underline text-primary"
                                    >
                                        {presetGoal.title}
                                    </Link>
                                </div>
                            )}

                            <Input
                                label="Title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                error={errors.title}
                                placeholder="Enter note title"
                                maxLength={100}
                                required
                            />

                            <MarkdownEditor
                                label="Content"
                                value={data.content}
                                onChange={(v) => setData('content', v)}
                                error={errors.content}
                                placeholder="Write your note content here..."
                                height={300}
                                required
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-outline-variant border-outline-variant">
                                <Button
                                    variant="ghost"
                                    as={Link}
                                    href={backHref}
                                >
                                    <ArrowLeft className="size-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    {processing ? 'Creating...' : 'Create Note'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}