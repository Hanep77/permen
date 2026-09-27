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
                        className="rounded-md bg-emerald-600 px-3 py-1 text-sm font-medium text-white"
                    >
                        <PaginationLabel label={link.label} />
                    </span>
                ) : link.url ? (
                    <Link
                        key={`${link.label}-${i}`}
                        href={link.url}
                        className={cn(
                            'rounded-md px-3 py-1 text-sm text-stone-600 hover:bg-stone-100',
                            'dark:text-stone-400 dark:hover:bg-stone-800',
                        )}
                    >
                        <PaginationLabel label={link.label} />
                    </Link>
                ) : (
                    <span key={`${link.label}-${i}`} className="px-3 py-1 text-sm text-stone-400">
                        <PaginationLabel label={link.label} />
                    </span>
                ),
            )}
        </div>
    );
}
