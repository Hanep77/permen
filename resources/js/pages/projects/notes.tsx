"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import notes from '@/routes/notes';
import projects from '@/routes/projects';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    CrudList,
    CrudListItem,
    CrudPagination,
    ItemTitle,
    type Paginated,
} from '@/components/crud';
import {
    ProjectLayout,
    type ProjectSummary,
} from '@/components/projects/project-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Note {
    id: number;
    title: string;
    created_at: string;
}

interface Props {
    project: ProjectSummary;
    notes: Paginated<Note>;
}

export default function ProjectNotes({ project, notes: notesData }: Props) {
    const createHref = notes.create.url({
        query: { project_id: project.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
        { title: project.title, href: projects.show(project.id).url },
        { title: 'Notes', href: projects.notes(project.id).url },
    ];

    (
        ProjectNotes as typeof ProjectNotes & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <ProjectLayout project={project} activeTab="notes">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Notes</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Note
                    </Button>
                </CardHeader>
                <CardContent>
                    {notesData.data.length === 0 ? (
                        <EmptyState title="No notes yet" />
                    ) : (
                        <CrudList>
                            {notesData.data.map((note) => (
                                <CrudListItem
                                    key={note.id}
                                    href={notes.show(note.id).url}
                                >
                                    <div className="flex flex-wrap items-center justify-between gap-2">
                                        <ItemTitle>{note.title}</ItemTitle>
                                        <span className="text-body-small text-on-surface-variant">
                                            {new Date(
                                                note.created_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                </CrudListItem>
                            ))}
                        </CrudList>
                    )}
                    <CrudPagination links={notesData.links} />
                </CardContent>
            </Card>
        </ProjectLayout>
    );
}
