"use client";

import { cn } from '@/lib/utils';
import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from './button';

interface EmptyStateProps {
    title: string;
    description?: string;
    action?: {
        label: string;
        href: string;
    };
    icon?: React.ReactNode;
}

export function EmptyState({ title, description, action, icon }: EmptyStateProps) {
    return (
        <div className={cn('flex flex-col items-center justify-center py-12 text-center', 'dark:text-stone-400')}>
            {icon && (
                <div className={cn('mb-4 text-stone-400', 'dark:text-stone-500')}>
                    {icon}
                </div>
            )}
            <h3 className={cn('text-lg font-medium text-stone-900', 'dark:text-stone-100')}>
                {title}
            </h3>
            {description && (
                <p className={cn('mt-2 text-sm text-stone-500', 'dark:text-stone-400')}>
                    {description}
                </p>
            )}
            {action && (
                <Button
                    as={Link}
                    href={action.href}
                    className="mt-4 gap-2"
                    size="sm"
                >
                    <Plus className="size-4" />
                    {action.label}
                </Button>
            )}
        </div>
    );
}