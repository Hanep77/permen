"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Search, Filter } from 'lucide-react';
import opportunities from '@/routes/opportunities'
import goals from '@/routes/goals';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface Opportunity {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    goal: { id: number; title: string } | null;
}

interface PaginatedOpportunities {
    data: Opportunity[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    status?: string;
    priority?: string;
    goal_id?: string;
    scope?: string;
}

export default function OpportunitiesIndex({ opportunities: opportunitiesData, filters }: { opportunities: PaginatedOpportunities; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [priority, setPriority] = useState(filters.priority || '');
    const [goalId, setGoalId] = useState(filters.goal_id || '');
    const [scope, setScope] = useState(filters.scope || 'independent');

    const { data, setData, post, processing } = useForm({
        search: search,
        status: status,
        priority: priority,
        goal_id: goalId,
        scope: scope,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.status = status;
        data.priority = priority;
        data.goal_id = goalId;
        data.scope = scope;
        post(opportunities.index().url, {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'new', label: 'New' },
        { value: 'considering', label: 'Considering' },
        { value: 'persuing', label: 'Pursuing' },
        { value: 'won', label: 'Won' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'expired', label: 'Expired' },
    ];

    const priorityOptions = [
        { value: '', label: 'All Priorities' },
        { value: 'low', label: 'Low' },
        { value: 'medium', label: 'Medium' },
        { value: 'high', label: 'High' },
    ];

    const scopeOptions = [
        { value: 'independent', label: 'Independent' },
        { value: 'all', label: 'All' },
    ];

    const getStatusVariant = (status: string) => {
        switch (status) {
            case 'won': return 'success';
            case 'persuing': return 'default';
            case 'considering': return 'warning';
            case 'rejected':
            case 'expired': return 'destructive';
            default: return 'secondary';
        }
    };

    const getPriorityVariant = (priority: string) => {
        switch (priority) {
            case 'high': return 'destructive';
            case 'medium': return 'warning';
            default: return 'secondary';
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Opportunities', href: opportunities.index().url },
    ];

    (OpportunitiesIndex as typeof OpportunitiesIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Opportunities" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Opportunities</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Track and manage your opportunities
                        </p>
                    </div>
                    <Button as={Link} href={opportunities.create().url}>
                        <Plus className="size-4" />
                        New Opportunity
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search opportunities..."
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
                                    value={priority}
                                    onChange={(e) => setPriority(e.target.value)}
                                    options={priorityOptions}
                                    placeholder="Filter by priority"
                                    className="pl-10 w-[160px]"
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
                        {opportunitiesData.data.length === 0 ? (
                            <EmptyState
                                title="No opportunities yet"
                                description="Create your first opportunity to start tracking potential wins."
                                action={{ label: 'Create Opportunity', href: opportunities.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {opportunitiesData.data.map((opp) => (
                                    <Link
                                        key={opp.id}
                                        href={opportunities.show(opp.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                    {opp.title}
                                                </h3>
                                                {opp.goal && (
                                                    <Link
                                                        href={goals.show(opp.goal.id).url}
                                                        className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        {opp.goal.title}
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-stone-500 line-clamp-1 dark:text-stone-400">
                                                {opp.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                                                <Badge variant={getStatusVariant(opp.status)}>
                                                    {opp.status.charAt(0).toUpperCase() + opp.status.slice(1)}
                                                </Badge>
                                                <Badge variant={getPriorityVariant(opp.priority)}>
                                                    {opp.priority.charAt(0).toUpperCase() + opp.priority.slice(1)}
                                                </Badge>
                                                <span>Due: {new Date(opp.due_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {opportunitiesData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {opportunitiesData.links.map((link) =>
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