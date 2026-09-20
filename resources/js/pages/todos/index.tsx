"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Search, Filter } from 'lucide-react';
import todos from '@/routes/todos'
import projects from '@/routes/projects'
import goals from '@/routes/goals';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface Todo {
    id: number;
    title: string;
    description: string;
    status: string;
    priority: string;
    due_date: string;
    project: { id: number; title: string } | null;
    goal: { id: number; title: string } | null;
    learning_item: { id: number; title: string } | null;
}

interface PaginatedTodos {
    data: Todo[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    status?: string;
    priority?: string;
    project_id?: string;
    goal_id?: string;
    learning_item_id?: string;
    scope?: string;
}

export default function TodosIndex({ todos: todosData, filters }: { todos: PaginatedTodos; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [status, setStatus] = useState(filters.status || '');
    const [priority, setPriority] = useState(filters.priority || '');
    const [projectId, setProjectId] = useState(filters.project_id || '');
    const [goalId, setGoalId] = useState(filters.goal_id || '');
    const [scope, setScope] = useState(filters.scope || 'independent');

    const { data, setData, post, processing } = useForm({
        search: search,
        status: status,
        priority: priority,
        project_id: projectId,
        goal_id: goalId,
        scope: scope,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.status = status;
        data.priority = priority;
        data.project_id = projectId;
        data.goal_id = goalId;
        data.scope = scope;
        post(todos.index().url, {
            preserveScroll: true,
            replace: true,
            onSuccess: () => {},
        });
    };

    const statusOptions = [
        { value: '', label: 'All Statuses' },
        { value: 'todo', label: 'To Do' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
        { value: 'cancelled', label: 'Cancelled' },
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
            case 'in_progress': return 'default';
            case 'completed': return 'success';
            case 'cancelled': return 'destructive';
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
        { title: 'Todos', href: todos.index().url },
    ];

    (TodosIndex as typeof TodosIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Todos" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Todos</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Manage your tasks and stay organized
                        </p>
                    </div>
                    <Button as={Link} href={todos.create().url}>
                        <Plus className="size-4" />
                        New Todo
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search todos..."
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
                                    className="pl-10 w-[160px]"
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
                        {todosData.data.length === 0 ? (
                            <EmptyState
                                title="No todos yet"
                                description="Create your first todo to start tracking tasks."
                                action={{ label: 'Create Todo', href: todos.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {todosData.data.map((todo) => (
                                    <Link
                                        key={todo.id}
                                        href={todos.show(todo.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 flex-wrap">
                                                <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                    {todo.title}
                                                </h3>
                                                {todo.project && (
                                                    <Link
                                                        href={projects.show(todo.project.id).url}
                                                        className="text-xs text-emerald-600 hover:underline dark:text-emerald-400"
                                                    >
                                                        {todo.project.title}
                                                    </Link>
                                                )}
                                                {todo.goal && (
                                                    <Link
                                                        href={goals.show(todo.goal.id).url}
                                                        className="text-xs text-blue-600 hover:underline dark:text-blue-400"
                                                    >
                                                        {todo.goal.title}
                                                    </Link>
                                                )}
                                                {todo.learning_item && (
                                                    <Link
                                                        href={learningItems.show(todo.learning_item.id).url}
                                                        className="text-xs text-purple-600 hover:underline dark:text-purple-400"
                                                    >
                                                        {todo.learning_item.title}
                                                    </Link>
                                                )}
                                            </div>
                                            <p className="mt-1 text-sm text-stone-500 line-clamp-1 dark:text-stone-400">
                                                {todo.description}
                                            </p>
                                            <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
                                                <Badge variant={getStatusVariant(todo.status)}>
                                                    {todo.status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                                                </Badge>
                                                <Badge variant={getPriorityVariant(todo.priority)}>
                                                    {todo.priority.charAt(0).toUpperCase() + todo.priority.slice(1)}
                                                </Badge>
                                                <span>Due: {new Date(todo.due_date).toLocaleDateString()}</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {todosData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {todosData.links.map((link) =>
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