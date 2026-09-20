"use client";

import { Head, Link, useForm } from '@inertiajs/react';
import { Plus, Search, Filter, BookOpen, GraduationCap, Play, FileText, Book } from 'lucide-react';
import learningItems from '@/routes/learning-items';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import type { BreadcrumbItem } from '@/types/navigation';
import { useState } from 'react';

interface LearningItem {
    id: number;
    title: string;
    type: string;
    completed_at: string | null;
}

interface PaginatedLearningItems {
    data: LearningItem[];
    links: Array<{ url: string | null; label: string; active: boolean }>;
}

interface Filters {
    search?: string;
    type?: string;
}

export default function LearningItemsIndex({ learningItems: learningItemsData, filters }: { learningItems: PaginatedLearningItems; filters: Filters }) {
    const [search, setSearch] = useState(filters.search || '');
    const [type, setType] = useState(filters.type || '');

    const { data, setData, post, processing } = useForm({
        search: search,
        type: type,
    });

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        data.search = search;
        data.type = type;
        post(learningItems.index().url, {
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

    const getTypeIcon = (type: string) => {
        switch (type) {
            case 'book': return <Book className="size-3" />;
            case 'course': return <GraduationCap className="size-3" />;
            case 'video': return <Play className="size-3" />;
            case 'paper': return <FileText className="size-3" />;
            default: return <BookOpen className="size-3" />;
        }
    };

    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Dashboard', href: '/dashboard' },
        { title: 'Learning Items', href: learningItems.index().url },
    ];

    (LearningItemsIndex as typeof LearningItemsIndex & { layout: { breadcrumbs: BreadcrumbItem[] } }).layout = {
        breadcrumbs,
    };

    return (
        <>
            <Head title="Learning Items" />
            <div className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-semibold tracking-tight">Learning Items</h1>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
                            Track your learning progress
                        </p>
                    </div>
                    <Button as={Link} href={learningItems.create().url}>
                        <Plus className="size-4" />
                        New Learning Item
                    </Button>
                </div>

                <Card>
                    <CardHeader className="pb-3">
                        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-stone-400" />
                                <Input
                                    placeholder="Search learning items..."
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
                        </form>
                    </CardHeader>
                    <CardContent className="pt-0">
                        {learningItemsData.data.length === 0 ? (
                            <EmptyState
                                title="No learning items yet"
                                description="Start tracking what you're learning."
                                action={{ label: 'Add Learning Item', href: learningItems.create().url }}
                            />
                        ) : (
                            <div className="space-y-4">
                                {learningItemsData.data.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={learningItems.show(item.id).url}
                                        className="flex items-center justify-between p-4 rounded-lg border border-stone-200 hover:bg-stone-50 transition-colors dark:border-stone-800 dark:hover:bg-stone-800"
                                    >
                                        <div className="flex-1 min-w-0 flex items-center gap-3">
                                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
                                                {getTypeIcon(item.type)}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-stone-900 truncate dark:text-stone-100">
                                                    {item.title}
                                                </h3>
                                                <p className="text-sm text-stone-500 dark:text-stone-400">
                                                    {item.type.charAt(0).toUpperCase() + item.type.slice(1)} ·{' '}
                                                    {item.completed_at ? 'Completed' : 'In Progress'}
                                                </p>
                                            </div>
                                        </div>
                                        <Badge variant={item.completed_at ? 'success' : 'default'}>
                                            {item.completed_at ? 'Completed' : 'In Progress'}
                                        </Badge>
                                    </Link>
                                ))}
                            </div>
                        )}

                        {learningItemsData.links.length > 1 && (
                            <div className="mt-6 flex items-center justify-center gap-1">
                                {learningItemsData.links.map((link) =>
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