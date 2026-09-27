"use client";

import { cn } from '@/lib/utils';

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?:
        | 'default'
        | 'secondary'
        | 'destructive'
        | 'outline'
        | 'success'
        | 'warning'
        | 'info';
}

export function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
    // M3 assist/filter-chip style: tonal containers, pill shape, label-small
    const variants = {
        default: 'bg-secondary-container text-on-secondary-container',
        secondary: 'bg-surface-container-highest text-on-surface-variant',
        destructive: 'bg-error-container text-on-error-container',
        outline: 'border border-outline bg-transparent text-on-surface-variant',
        success: 'bg-primary-container text-on-primary-container',
        warning: 'bg-tertiary-container text-on-tertiary-container',
        info: 'bg-secondary-container text-on-secondary-container',
    };

    return (
        <span
            className={cn(
                'inline-flex h-8 items-center gap-1.5 rounded-sm px-3 text-label-medium transition-colors',
                variants[variant],
                className,
            )}
            {...props}
        >
            {children}
        </span>
    );
}
