"use client";

import resources from '@/routes/resources';
import projects from '@/routes/projects';
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { Link } from '@inertiajs/react';
import { Globe } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    CrudFilterBar,
    CrudIndexLayout,
    CrudList,
    ItemDescription,
    ItemTitle,
    RelatedLink,
    formatLabel,
    resourceTypeOptions,
    scopeOptions,
    useCrudFilters,
    type Paginated,
    type RelatedRef,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';

interface Resource {
    id: number;
    title: string;
    description: string;
    type: string;
    url: string;
    project: RelatedRef | null;
    goal: RelatedRef | null;
    learning_item: RelatedRef | null;
}

interface Filters {
    search?: string;
    type?: string;
    project_id?: string;
    goal_id?: string;
    scope?: string;
}

export default function ResourcesIndex({
    resources: resourcesData,
    filters,
}: {
    resources: Paginated<Resource>;
    filters: Filters;
}) {
    const { values, set, update, submit } = useCrudFilters(resources.index().url, {
        search: filters.search || '',
        type: filters.type || '',
        scope: filters.scope || 'independent',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Resources', href: resources.index().url },
    ];

    (ResourcesIndex as typeof ResourcesIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Resources"
            description="Store and organize your reference materials"
            createHref={resources.create().url}
            createLabel="New Resource"
            emptyTitle="No resources yet"
            emptyDescription="Save your first resource to build your knowledge base."
            emptyActionLabel="Add Resource"
            isEmpty={resourcesData.data.length === 0}
            paginationLinks={resourcesData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search resources..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.type,
                            onChange: (v) => update('type', v),
                            options: resourceTypeOptions,
                            placeholder: 'Filter by type',
                            widthClassName: 'w-[180px]',
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
                {resourcesData.data.map((resource) => (
                    <div
                        key={resource.id}
                        className="flex items-center justify-between gap-2 rounded-lg border border-stone-200 p-4 transition-colors hover:bg-stone-50 dark:border-stone-800 dark:hover:bg-stone-800"
                    >
                        <Link
                            href={resources.show(resource.id).url}
                            className="min-w-0 flex-1"
                        >
                            <div className="flex flex-wrap items-center gap-2">
                                <ItemTitle>{resource.title}</ItemTitle>
                                <Badge variant="outline" className="text-xs">
                                    {formatLabel(resource.type)}
                                </Badge>
                                {resource.project && (
                                    <RelatedLink href={projects.show(resource.project.id).url}>
                                        {resource.project.title}
                                    </RelatedLink>
                                )}
                                {resource.goal && (
                                    <RelatedLink href={goals.show(resource.goal.id).url} tone="blue">
                                        {resource.goal.title}
                                    </RelatedLink>
                                )}
                                {resource.learning_item && (
                                    <RelatedLink
                                        href={learningItems.show(resource.learning_item.id).url}
                                        tone="purple"
                                    >
                                        {resource.learning_item.title}
                                    </RelatedLink>
                                )}
                            </div>
                            <ItemDescription>{resource.description}</ItemDescription>
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
            </CrudList>
        </CrudIndexLayout>
    );
}
