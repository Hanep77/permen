"use client";

import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Plus, Search, Filter, ChevronDown } from 'lucide-react';
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface Goal {
    id: number;
    title: string;
    description: string;
    status: string;
    target_date: string;
    projects_count?: number;
}

interface PaginatedGoals {
    data: Goal[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    status?: string;
}

export default function GoalsIndex({ goals: goalsData, filters }: { goals: PaginatedGoals; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');

    const { data, setData, post, processing } = useForm({
        search: search,
        status: status,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.status = status;
        post(goals.index().url, {
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
        { title: 'Goals', href: goals.index().url },
    ];

    (GoalsIndex as typeof GoalsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Goals" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Goals</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Track your long-term objectives and aspirations
                        </p>
                    </div>
                    <Button as={Link} href={goals.create().url}>
                        <Plus className="size-4" />
                        New Goal
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search goals..."
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
                                    className="pl-10 w-[200px]"
                                />
                            </div>
                        </form>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {goalsData.data.length === 0 ? (
                            <EmptyState
                                title="No goals yet"
                                description="Create your first goal to start tracking your objectives."
                                action={{ label: 'Create Goal', href: goals.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {goalsData.data.map((goal) => (
                                    <Link
                                        key={goal.id}
                                        href={goals.show(goal.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                {goal.title}
                                            </h3>
                                            <p className="mt-1 text-sm text-stone-500 line-clamp-1 dark:text-stone-400">
                                                {goal.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                                                <Badge variant={getStatusVariant(goal.status)}>
                                                    {goal.status.charAt(0).toUpperCase() + goal.status.slice(1)}
                                                </Badge>
                                                <span>Target: {new Date(goal.target_date).toLocaleDateString()}</span>
                                                {goal.projects_count && (
                                                    <span>{goal.projects_count} projects</span>
                                                )}
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {goalsData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {goalsData.links.map((link) =>
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