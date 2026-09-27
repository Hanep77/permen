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
        <div className={cn('flex flex-col items-center justify-center px-6 py-12 text-center')}>
            {icon && (
                <div
                    className={cn(
                        'mb-4 flex size-20 items-center justify-center rounded-full bg-secondary-container text-on-secondary-container [&_svg]:size-8',
                    )}
                >
                    {icon}
                </div>
            )}
            <h3 className={cn('text-title-large text-on-surface')}>{title}</h3>
            {description && (
                <p className={cn('mt-2 max-w-sm text-body-medium text-on-surface-variant')}>
                    {description}
                </p>
            )}
            {action && (
                <Button as={Link} href={action.href} className="mt-6 gap-2" size="default">
                    <Plus className="size-[18px]" />
                    {action.label}
                </Button>
            )}
        </div>
    );
}
