"use client";

import opportunities from '@/routes/opportunities';
import goals from '@/routes/goals';
import {
    CrudFilterBar,
    CrudIndexLayout,
    CrudList,
    CrudListItem,
    ItemDescription,
    ItemMeta,
    ItemTitle,
    RelatedLink,
    StatusBadge,
    opportunityStatusOptions,
    priorityOptions,
    scopeOptions,
    statusVariants,
    useCrudFilters,
    type Paginated,
    type RelatedRef,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';
import { stripMarkdown } from '@/components/ui/markdown-content';

interface Opportunity {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    goal: RelatedRef | null;
}

interface Filters {
    search?: string;
    status?: string;
    priority?: string;
    goal_id?: string;
    scope?: string;
}

export default function OpportunitiesIndex({
    opportunities: opportunitiesData,
    filters,
}: {
    opportunities: Paginated<Opportunity>;
    filters: Filters;
}) {
    const { values, set, update, submit } = useCrudFilters(opportunities.index().url, {
        search: filters.search || '',
        status: filters.status || '',
        priority: filters.priority || '',
        scope: filters.scope || 'independent',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Opportunities', href: opportunities.index().url },
    ];

    (OpportunitiesIndex as typeof OpportunitiesIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Opportunities"
            description="Track and manage your opportunities"
            createHref={opportunities.create().url}
            createLabel="New Opportunity"
            emptyTitle="No opportunities yet"
            emptyDescription="Create your first opportunity to start tracking potential wins."
            emptyActionLabel="Create Opportunity"
            isEmpty={opportunitiesData.data.length === 0}
            paginationLinks={opportunitiesData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search opportunities..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.status,
                            onChange: (v) => update('status', v),
                            options: opportunityStatusOptions,
                            placeholder: 'Filter by status',
                            widthClassName: 'w-[180px]',
                        },
                        {
                            value: values.priority,
                            onChange: (v) => update('priority', v),
                            options: priorityOptions,
                            placeholder: 'Filter by priority',
                            widthClassName: 'w-[160px]',
                        },
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
                {opportunitiesData.data.map((opp) => (
                    <CrudListItem key={opp.id} href={opportunities.show(opp.id).url}>
                        <div className="flex items-center gap-2">
                            <ItemTitle>{opp.title}</ItemTitle>
                            {opp.goal && (
                                <RelatedLink href={goals.show(opp.goal.id).url}>
                                    {opp.goal.title}
                                </RelatedLink>
                            )}
                        </div>
                        <ItemDescription>{stripMarkdown(opp.description)}</ItemDescription>
                        <ItemMeta>
                            <StatusBadge value={opp.status} variants={statusVariants.opportunity} />
                            <StatusBadge value={opp.priority} variants={statusVariants.priority} />
                            <span>Due: {new Date(opp.due_date).toLocaleDateString()}</span>
                        </ItemMeta>
                    </CrudListItem>
                ))}
            </CrudList>
        </CrudIndexLayout>
    );
}
