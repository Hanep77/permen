"use client";

import notes from '@/routes/notes';
import projects from '@/routes/projects';
import goals from '@/routes/goals';
import {
    CrudFilterBar,
    CrudIndexLayout,
    CrudList,
    CrudListItem,
    ItemTitle,
    RelatedLink,
    scopeOptions,
    useCrudFilters,
    type Paginated,
    type RelatedRef,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';

interface Note {
    id: number;
    title: string;
    project: RelatedRef | null;
    goal: RelatedRef | null;
}

interface Filters {
    search?: string;
    project_id?: string;
    goal_id?: string;
    scope?: string;
}

export default function NotesIndex({ notes: notesData, filters }: { notes: Paginated<Note>; filters: Filters }) {
    const { values, set, update, submit } = useCrudFilters(notes.index().url, {
        search: filters.search || '',
        scope: filters.scope || 'independent',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Notes', href: notes.index().url },
    ];
    (NotesIndex as typeof NotesIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Notes"
            description="Capture and organize your thoughts"
            createHref={notes.create().url}
            createLabel="New Note"
            emptyTitle="No notes yet"
            emptyDescription="Create your first note to start capturing ideas."
            emptyActionLabel="Create Note"
            isEmpty={notesData.data.length === 0}
            paginationLinks={notesData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search notes..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.scope,
                            onChange: (v) => update('scope', v),
                            options: scopeOptions,
                            placeholder: 'Scope',
                            widthClassName: 'w-[160px]',
                        },
                    ]}
                />
            }
        >
            <CrudList>
                {notesData.data.map((note) => (
                    <CrudListItem key={note.id} href={notes.show(note.id).url}>
                        <div className="flex flex-wrap items-center gap-2">
                            <ItemTitle>{note.title}</ItemTitle>
                            {note.project && (
                                <RelatedLink href={projects.show(note.project.id).url}>
                                    {note.project.title}
                                </RelatedLink>
                            )}
                            {note.goal && (
                                <RelatedLink href={goals.show(note.goal.id).url} tone="blue">
                                    {note.goal.title}
                                </RelatedLink>
                            )}
                        </div>
                    </CrudListItem>
                ))}
            </CrudList>
        </CrudIndexLayout>
    );
}
