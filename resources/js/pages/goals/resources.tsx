"use client";

import { Link } from '@inertiajs/react';
import { Globe, Plus } from 'lucide-react';
import resources from '@/routes/resources';
import goals from '@/routes/goals';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { stripMarkdown } from '@/components/ui/markdown-content';
import {
    CrudPagination,
    ItemDescription,
    ItemTitle,
    formatLabel,
    type Paginated,
} from '@/components/crud';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: string;
    url: string;
}

interface Props {
    goal: GoalSummary;
    resources: Paginated<Resource>;
}

export default function GoalResources({
    goal,
    resources: resourcesData,
}: Props) {
    const createHref = resources.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Resources', href: goals.resources(goal.id).url },
    ];

    (
        GoalResources as typeof GoalResources & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="resources">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Resources</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Resource
                    </Button>
                </CardHeader>
                <CardContent>
                    {resourcesData.data.length === 0 ? (
                        <EmptyState title="No resources yet" />
                    ) : (
                        <div className="divide-y divide-outline-variant">
                            {resourcesData.data.map((resource) => (
                                <div
                                    key={resource.id}
                                    className="flex items-center justify-between gap-2 p-4 transition-colors first:pt-0 last:pb-0 hover:bg-on-surface/5"
                                >
                                    <Link
                                        href={resources.show(resource.id).url}
                                        className="min-w-0 flex-1"
                                    >
                                        <div className="flex flex-wrap items-center gap-2">
                                            <ItemTitle>
                                                {resource.title}
                                            </ItemTitle>
                                            <Badge
                                                variant="outline"
                                                className="text-xs"
                                            >
                                                {formatLabel(resource.type)}
                                            </Badge>
                                        </div>
                                        <ItemDescription>
                                            {stripMarkdown(
                                                resource.description,
                                            )}
                                        </ItemDescription>
                                    </Link>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        as={Link}
                                        href={resource.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                    >
                                        <Globe className="size-4" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                    <CrudPagination links={resourcesData.links} />
                </CardContent>
            </Card>
        </GoalLayout>
    );
}
