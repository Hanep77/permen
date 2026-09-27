"use client";

import { Head } from '@inertiajs/react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { EmptyState } from '@/components/ui/empty-state';
import { CrudPageHeader } from './page-header';
import { CrudPagination } from './pagination';
import type { PaginationLink } from './types';

interface CrudIndexLayoutProps {
    title: string;
    description: string;
    createHref: string;
    createLabel: string;
    emptyTitle: string;
    emptyDescription: string;
    emptyActionLabel: string;
    isEmpty: boolean;
    filterBar: React.ReactNode;
    paginationLinks: PaginationLink[];
    children: React.ReactNode;
}

export function CrudIndexLayout({
    title,
    description,
    createHref,
    createLabel,
    emptyTitle,
    emptyDescription,
    emptyActionLabel,
    isEmpty,
    filterBar,
    paginationLinks,
    children,
}: CrudIndexLayoutProps) {
    return (
        <>
            <Head title={title} />
            <div className="space-y-6">
                <CrudPageHeader
                    title={title}
                    description={description}
                    createHref={createHref}
                    createLabel={createLabel}
                />
                <Card>
                    <CardHeader className="pb-3">{filterBar}</CardHeader>
                    <CardContent className="pt-0">
                        {isEmpty ? (
                            <EmptyState
                                title={emptyTitle}
                                description={emptyDescription}
                                action={{ label: emptyActionLabel, href: createHref }}
                            />
                        ) : (
                            children
                        )}
                        <CrudPagination links={paginationLinks} />
                    </CardContent>
                </Card>
            </div>
        </>
    );
}
