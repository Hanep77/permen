"use client";

import { Link } from '@inertiajs/react';
import { Globe, Plus } from 'lucide-react';
import resources from '@/routes/resources';
import projects from '@/routes/projects';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { stripMarkdown } from '@/components/ui/markdown-content';
import {
    CrudPagination,
    ItemDescription,
    ItemTitle,
    formatLabel,
    type Paginated,
} from '@/components/crud';
import {
    ProjectLayout,
    type ProjectSummary,
} from '@/components/projects/project-layout';
import type { BreadcrumbItem } from '@/types/navigation';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: string;
    url: string;
    created_at: string;
}

interface Props {
    project: ProjectSummary;
    resources: Paginated<Resource>;
}

export default function ProjectResources({
    project,
    resources: resourcesData,
}: Props) {
    const createHref = resources.create.url({
        query: { project_id: project.id },
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
        { title: project.title, href: projects.show(project.id).url },
        { title: 'Resources', href: projects.resources(project.id).url },
    ];

    (
        ProjectResources as typeof ProjectResources & {
            layout: { breadcrumbs: BreadcrumbItem[] };
        }
    ).layout = {
        breadcrumbs,
    };

    return (
        <ProjectLayout project={project} activeTab="resources">
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
        </ProjectLayout>
    );
}
