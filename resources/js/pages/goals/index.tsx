"use client";

import goals from '@/routes/goals';
import {
    CrudFilterBar,
    CrudIndexLayout,
    CrudList,
    CrudListItem,
    ItemDescription,
    ItemMeta,
    ItemTitle,
    StatusBadge,
    statusOptions,
    statusVariants,
    useCrudFilters,
    type Paginated,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';

interface Goal {
    id: number;
    title: string;
    description: string;
    status: string;
    target_date: string;
    projects_count?: number;
}

interface Filters {
    search?: string;
    status?: string;
}

export default function GoalsIndex({ goals: goalsData, filters }: { goals: Paginated<Goal>; filters: Filters }) {
    const { values, set, update, submit } = useCrudFilters(goals.index().url, {
        search: filters.search || '',
        status: filters.status || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
    ];

    (GoalsIndex as typeof GoalsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Goals"
            description="Track your long-term objectives and aspirations"
            createHref={goals.create().url}
            createLabel="New Goal"
            emptyTitle="No goals yet"
            emptyDescription="Create your first goal to start tracking your objectives."
            emptyActionLabel="Create Goal"
            isEmpty={goalsData.data.length === 0}
            paginationLinks={goalsData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search goals..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.status,
                            onChange: (v) => update('status', v),
                            options: statusOptions,
                            placeholder: 'Filter by status',
                            widthClassName: 'w-[200px]',
                        },
                    ]}
                />
            }
        >
            <CrudList>
                {goalsData.data.map((goal) => (
                    <CrudListItem key={goal.id} href={goals.show(goal.id).url}>
                        <ItemTitle>{goal.title}</ItemTitle>
                        <ItemDescription>{goal.description}</ItemDescription>
                        <ItemMeta>
                            <StatusBadge value={goal.status} variants={statusVariants.goal} />
                            <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                            {goal.projects_count ? <span>{goal.projects_count} projects</span> : null}
                        </ItemMeta>
                    </CrudListItem>
                ))}
            </CrudList>
        </CrudIndexLayout>
    );
}
