"use client";

import projects from '@/routes/projects';
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
    statusOptions,
    statusVariants,
    useCrudFilters,
    type Paginated,
    type RelatedRef,
} from '@/components/crud';
import type { BreadcrumbItem } from '@/types/navigation';
import { stripMarkdown } from '@/components/ui/markdown-content';

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    target_date: string;
    goal: RelatedRef | null;
}

interface Filters {
    search?: string;
    status?: string;
    goal_id?: string;
}

export default function ProjectsIndex({
    projects: projectsData,
    filters,
}: {
    projects: Paginated<Project>;
    filters: Filters;
}) {
    const { values, set, update, submit } = useCrudFilters(projects.index().url, {
        search: filters.search || '',
        status: filters.status || '',
    });

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
    ];

    (ProjectsIndex as typeof ProjectsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <CrudIndexLayout
            title="Projects"
            description="Manage your projects and track progress"
            createHref={projects.create().url}
            createLabel="New Project"
            emptyTitle="No projects yet"
            emptyDescription="Create your first project to start organizing your work."
            emptyActionLabel="Create Project"
            isEmpty={projectsData.data.length === 0}
            paginationLinks={projectsData.links}
            filterBar={
                <CrudFilterBar
                    searchValue={values.search}
                    onSearchChange={(v) => set('search', v)}
                    searchPlaceholder="Search projects..."
                    onSubmit={submit}
                    fields={[
                        {
                            value: values.status,
                            onChange: (v) => update('status', v),
                            options: statusOptions,
                            placeholder: 'Filter by status',
                            widthClassName: 'w-[180px]',
                        },
                    ]}
                />
            }
        >
            <CrudList>
                {projectsData.data.map((project) => (
                    <CrudListItem key={project.id} href={projects.show(project.id).url}>
                        <div className="flex items-center gap-2">
                            <ItemTitle>{project.title}</ItemTitle>
                            {project.goal && (
                                <RelatedLink href={goals.show(project.goal.id).url}>
                                    {project.goal.title}
                                </RelatedLink>
                            )}
                        </div>
                        <ItemDescription>{stripMarkdown(project.description)}</ItemDescription>
                        <ItemMeta>
                            <StatusBadge value={project.status} variants={statusVariants.project} />
                            <span>Target: {new Date(project.target_date).toLocaleDateString()}</span>
                        </ItemMeta>
                    </CrudListItem>
                ))}
            </CrudList>
        </CrudIndexLayout>
    );
}
