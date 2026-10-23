"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import notes from '@/routes/notes';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    CrudList,
    CrudListItem,
    CrudPagination,
    ItemTitle,
    type Paginated,
} from '@/components/crud';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Note {
    id: number;
    title: string;
    created_at: string;
}

interface Props {
    goal: GoalSummary;
    notes: Paginated<Note>;
}

export default function GoalNotes({ goal, notes: notesData }: Props) {
    const createHref = notes.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Notes', href: goals.notes(goal.id).url },
    ];

    (
        GoalNotes as typeof GoalNotes & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="notes">
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
        </GoalLayout>
    );
}
