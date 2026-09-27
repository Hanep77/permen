"use client";

import { Link } from '@inertiajs/react';
import { Badge, type BadgeProps } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { formatLabel } from './status';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export function StatusBadge({
    value,
    variants,
    fallback = 'secondary',
}: {
    value: string;
    variants: Record<string, BadgeVariant>;
    fallback?: BadgeVariant;
}) {
    return <Badge variant={variants[value] ?? fallback}>{formatLabel(value)}</Badge>;
}

export function CrudList({ children }: { children: React.ReactNode }) {
    return <div className="space-y-4">{children}</div>;
}

export function CrudListItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center justify-between rounded-lg border border-stone-200 p-4 transition-colors hover:bg-stone-50',
                'dark:border-stone-800 dark:hover:bg-stone-800',
            )}
        >
            <div className="min-w-0 flex-1">{children}</div>
        </Link>
    );
}

export function ItemTitle({ children }: { children: React.ReactNode }) {
    return (
        <h3 className="truncate font-medium text-stone-900 dark:text-stone-100">{children}</h3>
    );
}

export function ItemDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-1 line-clamp-1 text-sm text-stone-500 dark:text-stone-400">{children}</p>
    );
}

export function ItemMeta({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-2 flex items-center gap-3 text-xs text-stone-500 dark:text-stone-400">
            {children}
        </div>
    );
}

const relatedTones = {
    emerald: 'text-emerald-600 hover:underline dark:text-emerald-400',
    blue: 'text-blue-600 hover:underline dark:text-blue-400',
    purple: 'text-purple-600 hover:underline dark:text-purple-400',
} as const;

export function RelatedLink({
    href,
    tone = 'emerald',
    children,
    onClick,
}: {
    href: string;
    tone?: keyof typeof relatedTones;
    children: React.ReactNode;
    onClick?: (e: React.MouseEvent) => void;
}) {
    return (
        <Link
            href={href}
            onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
            }}
            className={cn('text-xs', relatedTones[tone])}
        >
            {children}
        </Link>
    );
}
