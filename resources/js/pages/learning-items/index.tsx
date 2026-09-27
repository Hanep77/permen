"use client";

import learningItems from '@/routes/learning-items';
import goals from '@/routes/goals';
import { Book, BookOpen, FileText, GraduationCap, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
    CrudFilterBar,
    CrudIndexLayout,
    CrudList,
    CrudListItem,
    ItemTitle,
    RelatedLink,
    resourceTypeOptions,
    useCrudFilters,
    type Paginated,
    type RelatedRef,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';

interface LearningItem {
    id: number;
    title: string;
    type: string;
    completed_at: string | null;
    goal: RelatedRef | null;
}

interface Filters {
    search?: string;
    type?: string;
}

function getTypeIcon(type: string) {
    switch (type) {
        case 'book':
            return <Book className="size-3" />;
        case 'course':
            return <GraduationCap className="size-3" />;
        case 'video':
            return <Play className="size-3" />;
        case 'paper':
            return <FileText className="size-3" />;
        default:
            return <BookOpen className="size-3" />;
    }
}

export default function LearningItemsIndex({
    learningItems: learningItemsData,
    filters,
}: {
    learningItems: Paginated<LearningItem>;
    filters: Filters;
}) {
    const { values, set, update, submit } = useCrudFilters(learningItems.index().url, {
        search: filters.search || '',
        type: filters.type || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Items', href: learningItems.index().url },
    ];

    (LearningItemsIndex as typeof LearningItemsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Learning Items"
            description="Track your learning progress"
            createHref={learningItems.create().url}
            createLabel="New Learning Item"
            emptyTitle="No learning items yet"
            emptyDescription="Start tracking what you're learning."
            emptyActionLabel="Add Learning Item"
            isEmpty={learningItemsData.data.length === 0}
            paginationLinks={learningItemsData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search learning items..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.type,
                            onChange: (v) => update('type', v),
                            options: resourceTypeOptions,
                            placeholder: 'Filter by type',
                            widthClassName: 'w-[180px]',
                        },
                    ]}
                />
            }
        >
            <CrudList>
                {learningItemsData.data.map((item) => (
                    <CrudListItem key={item.id} href={learningItems.show(item.id).url}>
                        <div className="flex flex-1 items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                    {getTypeIcon(item.type)}
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <ItemTitle>{item.title}</ItemTitle>
                                        {item.goal && (
                                            <RelatedLink href={goals.show(item.goal.id).url}>
                                                {item.goal.title}
                                            </RelatedLink>
                                        )}
                                    </div>
                                    <p className="text-sm text-stone-500 dark:text-stone-400">
                                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)} ·{' '}
                                        {item.completed_at ? 'Completed' : 'In Progress'}
                                    </p>
                                </div>
                            </div>
                            <Badge variant={item.completed_at ? 'success' : 'default'}>
                                {item.completed_at ? 'Completed' : 'In Progress'}
                            </Badge>
                        </div>
                    </CrudListItem>
                ))}
            </CrudList>
        </CrudIndexLayout>
    );
}
