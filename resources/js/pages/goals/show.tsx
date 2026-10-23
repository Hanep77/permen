"use client";

import { Link } from '@inertiajs/react';
import { Calendar, Clock, Plus, Target } from 'lucide-react';
import goals from '@/routes/goals';
import projects from '@/routes/projects';
import opportunities from '@/routes/opportunities';
import notes from '@/routes/notes';
import resources from '@/routes/resources';
import todos from '@/routes/todos';
import learningItems from '@/routes/learning-items';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MarkdownContent } from '@/components/ui/markdown-content';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Props {
    goal: GoalSummary;
}

function getStatusVariant(status: string) {
    switch (status) {
        case 'active':
            return 'default';
        case 'completed':
            return 'success';
        case 'abandoned':
            return 'destructive';
        default:
            return 'secondary';
    }
}

export default function GoalsShow({ goal }: Props) {
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
    ];

    (
        GoalsShow as typeof GoalsShow & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="overview">
            <div className="grid gap-6 lg:grid-cols-3">
                <div className="space-y-6 lg:col-span-2">
                    <Card>
                        <CardHeader>
                            <CardTitle>Description</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <MarkdownContent content={goal.description} />
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-on-surface-variant">
                                        Current Status
                                    </span>
                                    <Badge
                                        variant={getStatusVariant(goal.status)}
                                        className="px-3 py-1 text-base"
                                    >
                                        {goal.status.charAt(0).toUpperCase() +
                                            goal.status.slice(1)}
                                    </Badge>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-on-surface-variant">
                                        Start Date
                                    </span>
                                    <span className="text-sm font-medium">
                                        <Calendar className="mr-1 inline size-4" />
                                        {new Date(
                                            goal.start_date,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-sm text-on-surface-variant">
                                        Target Date
                                    </span>
                                    <span className="text-sm font-medium">
                                        <Target className="mr-1 inline size-4" />
                                        {new Date(
                                            goal.target_date,
                                        ).toLocaleDateString()}
                                    </span>
                                </div>
                                {goal.completed_at && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-on-surface-variant">
                                            Completed At
                                        </span>
                                        <span className="text-sm font-medium">
                                            <Clock className="mr-1 inline size-4" />
                                            {new Date(
                                                goal.completed_at,
                                            ).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <Button
                                as={Link}
                                href={projects.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Project
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                href={opportunities.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Opportunity
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                href={notes.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Note
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                href={resources.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Resource
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                href={todos.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Todo
                            </Button>
                            <Button
                                variant="outline"
                                as={Link}
                                href={learningItems.create.url({
                                    query: { goal_id: goal.id },
                                })}
                                className="w-full justify-start"
                            >
                                <Plus className="size-4" />
                                Add Learning Item
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </GoalLayout>
    );
}
