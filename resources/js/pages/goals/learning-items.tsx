"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import goals from '@/routes/goals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    CrudList,
    CrudListItem,
    CrudPagination,
    ItemTitle,
    formatLabel,
    type Paginated,
} from '@/components/crud';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface LearningItem {
    id: number;
    title: string;
    type: string;
    completed_at: string | null;
}

interface Props {
    goal: GoalSummary;
    learningItems: Paginated<LearningItem>;
}

export default function GoalLearningItems({
    goal,
    learningItems: learningItemsData,
}: Props) {
    const createHref = learningItems.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Learning Items', href: goals.learningItems(goal.id).url },
    ];

    (
        GoalLearningItems as typeof GoalLearningItems & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="learningItems">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Learning Items</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Learning Item
                    </Button>
                </CardHeader>
                <CardContent>
                    {learningItemsData.data.length === 0 ? (
                        <EmptyState title="No learning items yet" />
                    ) : (
                        <CrudList>
                            {learningItemsData.data.map((learningItem) => (
                                <CrudListItem
                                    key={learningItem.id}
                                    href={
                                        learningItems.show(learningItem.id).url
                                    }
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <ItemTitle>
                                            {learningItem.title}
                                        </ItemTitle>
                                        <Badge
                                            variant="outline"
                                            className="text-xs"
                                        >
                                            {formatLabel(learningItem.type)}
                                        </Badge>
                                        <Badge
                                            variant={
                                                learningItem.completed_at
                                                    ? 'success'
                                                    : 'default'
                                            }
                                        >
                                            {learningItem.completed_at
                                                ? 'Completed'
                                                : 'In Progress'}
                                        </Badge>
                                    </div>
                                </CrudListItem>
                            ))}
                        </CrudList>
                    )}
                    <CrudPagination links={learningItemsData.links} />
                </CardContent>
            </Card>
        </GoalLayout>
    );
}
