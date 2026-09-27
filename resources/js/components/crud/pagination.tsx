"use client";

import { Link } from '@inertiajs/react';
import { cn } from '@/lib/utils';
import type { PaginationLink } from './types';

function PaginationLabel({ label }: { label: string }) {
    return <span dangerouslySetInnerHTML={{ __html: label }} />;
}

export function CrudPagination({ links }: { links: PaginationLink[] }) {
    if (links.length <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex items-center justify-center gap-1">
            {links.map((link, i) =>
                link.active ? (
                    <span
                        key={`${link.label}-${i}`}
                        className="flex h-10 min-w-10 items-center justify-center rounded-full bg-secondary-container px-3 text-label-large text-on-secondary-container"
                    >
                        <PaginationLabel label={link.label} />
                    </span>
                ) : link.url ? (
                    <Link
                        key={`${link.label}-${i}`}
                        href={link.url}
                        className={cn(
                            'flex h-10 min-w-10 items-center justify-center rounded-full px-3 text-label-large text-on-surface-variant transition hover:bg-on-surface/8',
                        )}
                    >
                        <PaginationLabel label={link.label} />
                    </Link>
                ) : (
                    <span
                        key={`${link.label}-${i}`}
                        className="flex h-10 min-w-10 items-center justify-center px-3 text-label-large text-on-surface/40"
                    >
                        <PaginationLabel label={link.label} />
                    </span>
                ),
            )}
        </div>
    );
}
