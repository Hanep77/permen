"use client";

import { cn } from '@/lib/utils';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    /** M3 card type: elevated | filled | outlined */
    variant?: 'elevated' | 'filled' | 'outlined';
}

export function Card({ className, variant = 'outlined', children, ...props }: CardProps) {
    const variants = {
        // M3 elevated: surface-container-low + level 1
        elevated:
            'border-0 bg-surface-container-low shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)]',
        // M3 filled: surface-container-highest, no border
        filled: 'border-0 bg-surface-container-highest',
        // M3 outlined: surface + outline-variant border
        outlined: 'border border-outline-variant bg-surface',
    };

    return (
        <div
            className={cn('rounded-md text-on-surface', variants[variant], className)}
            {...props}
        >
            {children}
        </div>
    );
}

export function CardHeader({ className, children, ...props }: CardProps) {
    return (
        <div className={cn('flex flex-col space-y-1.5 p-6', className)} {...props}>
            {children}
        </div>
    );
}

export function CardTitle({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
    return (
        <h3 className={cn('text-title-large text-on-surface', className)} {...props}>
            {children}
        </h3>
    );
}

export function CardDescription({
    className,
    children,
    ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-body-medium text-on-surface-variant', className)} {...props}>
            {children}
        </p>
    );
}

export function CardContent({ className, children, ...props }: CardProps) {
    return (
        <div className={cn('p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}

export function CardFooter({ className, children, ...props }: CardProps) {
    return (
        <div className={cn('flex items-center p-6 pt-0', className)} {...props}>
            {children}
        </div>
    );
}
