"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import projects from '@/routes/projects';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import {
    CrudList,
    CrudListItem,
    CrudPagination,
    ItemTitle,
    StatusBadge,
    statusVariants,
    type Paginated,
} from '@/components/crud';
import { GoalLayout, type GoalSummary } from '@/components/goals/goal-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Project {
    id: number;
    title: string;
    status: string;
}

interface Props {
    goal: GoalSummary;
    projects: Paginated<Project>;
}

export default function GoalProjects({ goal, projects: projectsData }: Props) {
    const createHref = projects.create.url({
        query: { goal_id: goal.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Goals', href: goals.index().url },
        { title: goal.title, href: goals.show(goal.id).url },
        { title: 'Projects', href: goals.projects(goal.id).url },
    ];

    (
        GoalProjects as typeof GoalProjects & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <GoalLayout goal={goal} activeTab="projects">
            <Card>
                <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-4">
                    <CardTitle>Projects</CardTitle>
                    <Button as={Link} href={createHref}>
                        <Plus className="size-4" />
                        Add Project
                    </Button>
                </CardHeader>
                <CardContent>
                    {projectsData.data.length === 0 ? (
                        <EmptyState title="No projects yet" />
                    ) : (
                        <CrudList>
                            {projectsData.data.map((project) => (
                                <CrudListItem
                                    key={project.id}
                                    href={projects.show(project.id).url}
                                >
                                    <div className="flex flex-wrap items-center gap-2">
                                        <ItemTitle>{project.title}</ItemTitle>
                                        <StatusBadge
                                            value={project.status}
                                            variants={statusVariants.project}
                                        />
                                    </div>
                                </CrudListItem>
                            ))}
                        </CrudList>
                    )}
                    <CrudPagination links={projectsData.links} />
                </CardContent>
            </Card>
        </GoalLayout>
    );
}
