"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Save } from 'lucide-react';
import notes from '@/routes/notes'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MarkdownEditor } from '@/components/ui/markdown-editor';
import { Select } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    note: {
        id: number;
        project_id: number | null;
        goal_id: number | null;
        title: string;
        content: string;
    };
    projects: Array<{ id: number; title: string }>;
    goals: Array<{ id: number; title: string }>;
}

export default function NotesEdit({ note, projects: projectsList, goals: goalsList }: Props) {
    const { data, setData, put, processing, errors } = useForm({
        project_id: note.project_id?.toString() || '',
        goal_id: note.goal_id?.toString() || '',
        title: note.title,
        content: note.content,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        put(notes.update(note.id).url, {
            onSuccess: () => {},
        });
    };

    const projectOptions = [
        { value: '', label: 'Select a project (optional)' },
        ...projectsList.map((p) => ({ value: p.id.toString(), label: p.title })),
    ];

    const goalOptions = [
        { value: '', label: 'Select a goal (optional)' },
        ...goalsList.map((g) => ({ value: g.id.toString(), label: g.title })),
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notes', href: notes.index().url },
        { title: note.title, href: notes.show(note.id).url },
        { title: 'Edit', href: notes.edit(note.id).url },
    ];

    (NotesEdit as typeof NotesEdit & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title={`Edit ${note.title}`} />
            <div className="space-y-6">
                <div>
                    <div>
                        <h1 className="text-headline-small text-on-surface">Edit Note</h1>
                        <p className="mt-1 text-sm text-on-surface-variant text-on-surface-variant">
                            Update your note
                        </p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Note Details</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <Select
                                label="Project (Optional)"
                                value={data.project_id}
                                onChange={(e) => setData('project_id', e.target.value)}
                                options={projectOptions}
                                placeholder="Link to a project"
                            />

                            <Select
                                label="Goal (Optional)"
                                value={data.goal_id}
                                onChange={(e) => setData('goal_id', e.target.value)}
                                options={goalOptions}
                                placeholder="Link to a goal"
                            />

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
                                    href={notes.show(note.id).url}
                                >
                                    <ArrowLeft className="size-4" />
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    <Save className="size-4" />
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}