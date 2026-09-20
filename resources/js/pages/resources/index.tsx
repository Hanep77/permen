"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Search, Filter, Globe } from 'lucide-react';
import resources from '@/routes/resources'
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

interface Resource {
    id: number;
    title: string;
    description: string;
    type: string;
    url: string;
    project: { id: number; title: string } | null;
    goal: { id: number; title: string } | null;
}

interface PaginatedResources {
    data: Resource[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    type?: string;
    project_id?: string;
    goal_id?: string;
    scope?: string;
}

export default function ResourcesIndex({ resources: resourcesData, filters }: { resources: PaginatedResources; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [goalId, setGoalId] = useState(filters.goal_id || '');
    const [scope, setScope] = useState(filters.scope || 'independent');

    const { data, setData, post, processing } = useForm({
        search: search,
        type: type,
        project_id: projectId,
        goal_id: goalId,
        scope: scope,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.type = type;
        data.project_id = projectId;
        data.goal_id = goalId;
        data.scope = scope;
        post(resources.index().url, {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {},
        });
    };

    const typeOptions = [
        { value: '', label: 'All Types' },
        { value: 'book', label: 'Book' },
        { value: 'course', label: 'Course' },
        { value: 'tutorial', label: 'Tutorial' },
        { value: 'paper', label: 'Paper' },
        { value: 'article', label: 'Article' },
        { value: 'video', label: 'Video' },
        { value: 'documentation', label: 'Documentation' },
        { value: 'website', label: 'Website' },
        { value: 'other', label: 'Other' },
    ];

    const scopeOptions = [
        { value: 'independent', label: 'Independent' },
        { value: 'all', label: 'All' },
    ];

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Resources', href: resources.index().url },
    ];

    (ResourcesIndex as typeof ResourcesIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Resources" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Resources</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Store and organize your reference materials
                        </p>
                    </div>
                    <Button as={Link} href={resources.create().url}>
                        <Plus className="size-4" />
                        New Resource
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search resources..."
                                    value={search}
                                    onChange={(e) => setSearch(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Select
                                    value={type}
                                    onChange={(e) => setType(e.target.value)}
                                    options={typeOptions}
                                    placeholder="Filter by type"
                                    className="pl-10 w-[180px]"
                                />
                            </div>
                            <div className="relative">
                                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Select
                                    value={scope}
                                    onChange={(e) => setScope(e.target.value)}
                                    options={scopeOptions}
                                    placeholder="Scope"
                                    className="pl-10 w-[160px]"
                                />
                            </div>
                        </form>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {resourcesData.data.length === 0 ? (
                            <EmptyState
                                title="No resources yet"
                                description="Save your first resource to build your knowledge base."
                                action={{ label: 'Add Resource', href: resources.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {resourcesData.data.map((resource) => (
                                    <Link
                                        key={resource.id}
                                        href={resources.show(resource.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                    {resource.title}
                                                </h3>
                                                <Badge variant="outline" className="text-xs">
                                                    {resource.type.charAt(0).toUpperCase() + resource.type.slice(1)}
                                                </Badge>
                                                {resource.project && (
                                                    <Link
                                                        href={projects.show(resource.project.id).url}
                                                        className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        {resource.project.title}
                                                    </Link>
                                                )}
                                                {resource.goal && (
                                                    <Link
                                                        href={goals.show(resource.goal.id).url}
                                                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        {resource.goal.title}
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-stone-500 line-clamp-1 dark:text-stone-400">
                                                {resource.description}
                                            </p>
                                        </div>
                                        <Button variant="ghost" size="icon" as={Link} href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <Globe className="size-4" />
                                        </Button>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {resourcesData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {resourcesData.links.map((link) =>
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