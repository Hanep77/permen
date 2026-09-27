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
    return (
        <div className="divide-y divide-outline-variant overflow-hidden rounded-md bg-surface">
            {children}
        </div>
    );
}

export function CrudListItem({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className={cn(
                'flex items-center justify-between gap-4 px-4 py-3 transition-colors hover:bg-on-surface/5 focus:bg-on-surface/8 sm:px-6',
            )}
        >
            <div className="min-w-0 flex-1">{children}</div>
        </Link>
    );
}

export function ItemTitle({ children }: { children: React.ReactNode }) {
    return <h3 className="truncate text-body-large text-on-surface">{children}</h3>;
}

export function ItemDescription({ children }: { children: React.ReactNode }) {
    return (
        <p className="mt-0.5 line-clamp-1 text-body-medium text-on-surface-variant">
            {children}
        </p>
    );
}

export function ItemMeta({ children }: { children: React.ReactNode }) {
    return (
        <div className="mt-1.5 flex flex-wrap items-center gap-2 text-body-small text-on-surface-variant">
            {children}
        </div>
    );
}

const relatedTones = {
    emerald: 'text-primary hover:underline',
    blue: 'text-secondary hover:underline',
    purple: 'text-tertiary hover:underline',
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
            className={cn(
                'rounded-xs px-1 text-body-small font-medium',
                relatedTones[tone],
            )}
        >
            {children}
        </Link>
    );
}
