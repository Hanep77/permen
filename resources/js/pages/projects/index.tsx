"use client";

import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Search, Filter } from 'lucide-react';
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface Project {
    id: number;
    title: string;
    description: string;
    status: string;
    target_date: string;
    goal: { id: number; title: string } | null;
}

interface PaginatedProjects {
    data: Project[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    status?: string;
    goal_id?: string;
}

export default function ProjectsIndex({ projects: projectsData, filters }: { projects: PaginatedProjects; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [goalId, setGoalId] = useState(filters.goal_id || '');

    const { data, setData, post, processing } = useForm({
        search: search,
        status: status,
        goal_id: goalId,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.status = status;
        data.goal_id = goalId;
        post(projects.index().url, {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'draft', label: 'Draft' },
        { value: 'active', label: 'Active' },
        { value: 'completed', label: 'Completed' },
        { value: 'abandoned', label: 'Abandoned' },
    ];

    const goalOptions = [{ value: '', label: 'All Goals' }];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'active': return 'default';
            case 'completed': return 'success';
            case 'abandoned': return 'destructive';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Projects', href: projects.index().url },
    ];

    (ProjectsIndex as typeof ProjectsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Projects" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Projects</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Manage your projects and track progress
                        </p>
                    </div>
                    <Button as={Link} href={projects.create().url}>
                        <Plus className="size-4" />
                        New Project
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search projects..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Select
                                    value={status}
                                    onChange={(e) => setStatus(e.target.value)}
                                    options={statusOptions}
                                    placeholder="Filter by status"
                                    className="pl-10 w-[180px]"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Select
                                    value={goalId}
                                    onChange={(e) => setGoalId(e.target.value)}
                                    options={goalOptions}
                                    placeholder="Filter by goal"
                                    className="pl-10 w-[200px]"
                                />
                            </div>
                        </form>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {projectsData.data.length === 0 ? (
                            <EmptyState
                                title="No projects yet"
                                description="Create your first project to start organizing your work."
                                action={{ label: 'Create Project', href: projects.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {projectsData.data.map((project) => (
                                    <Link
                                        key={project.id}
                                        href={projects.show(project.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                    {project.title}
                                                </h3>
                                                {project.goal && (
                                                    <Link
                                                        href={goals.show(project.goal.id).url}
                                                        className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        {project.goal.title}
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-stone-500 line-clamp-1 dark:text-stone-400">
                                                {project.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                                                <Badge variant={getStatusVariant(project.status)}>
                                                    {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                                                </Badge>
                                                <span>Target: {new Date(project.target_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {projectsData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {projectsData.links.map((link) =>
                                    link.active ? (
                                        <span
                                            key={link.url}
                                            className="px-3 py-1 text-sm font-medium text-white bg-emerald-600 rounded-md"
                                        >
                                            {link.label}
                                        </span>
                                    ) : link.url ? (
                                        <Link
                                            key={link.url}
                                            href={link.url}
                                            className="px-3 py-1 text-sm text-stone-600 hover:bg-stone-100 rounded-md dark:text-stone-400 dark:hover:bg-stone-800"
                                        >
                                            {link.label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={link.label}
                                            className="px-3 py-1 text-sm text-stone-400"
                                        >
                                            {link.label}
                                        </span>
                                    )
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </>
    );
}