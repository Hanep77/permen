"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import opportunities from '@/routes/opportunities';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { stripMarkdown } from '@/components/ui/markdown-content';
import {
    CrudList,
    CrudListItem,
    CrudPagination,
    ItemDescription,
    ItemMeta,
    ItemTitle,
    StatusBadge,
    statusVariants,
    type Paginated,
} from '@/components/crud';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Opportunity {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
}

interface Props {
    goal: GoalSummary;
    opportunities: Paginated<Opportunity>;
}

export default function GoalOpportunities({
    goal,
    opportunities: opportunitiesData,
}: Props) {
    const createHref = opportunities.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Opportunities', href: goals.opportunities(goal.id).url },
    ];

    (
        GoalOpportunities as typeof GoalOpportunities & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="opportunities">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Opportunities</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Opportunity
                    </Button>
                </CardHeader>
                <CardContent>
                    {opportunitiesData.data.length === 0 ? (
                        <EmptyState title="No opportunities yet" />
                    ) : (
                        <CrudList>
                            {opportunitiesData.data.map((opportunity) => (
                                <CrudListItem
                                    key={opportunity.id}
                                    href={opportunities.show(opportunity.id).url}
                                >
                                    <ItemTitle>{opportunity.title}</ItemTitle>
                                    <ItemDescription>
                                        {stripMarkdown(opportunity.description)}
                                    </ItemDescription>
                                    <ItemMeta>
                                        <StatusBadge
                                            value={opportunity.status}
                                            variants={
                                                statusVariants.opportunity
                                            }
                                        />
                                        <StatusBadge
                                            value={opportunity.priority}
                                            variants={statusVariants.priority}
                                        />
                                        <span>
                                            Due:{' '}
                                            {new Date(
                                                opportunity.due_date,
                                            ).toLocaleDateString()}
                                        </span>
                                    </ItemMeta>
                                </CrudListItem>
                            ))}
                        </CrudList>
                    )}
                    <CrudPagination links={opportunitiesData.links} />
                </CardContent>
            </Card>
        </GoalLayout>
    );
}
