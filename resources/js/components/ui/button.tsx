"use client";

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type InertiaLinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
    size?: 'default' | 'sm' | 'lg' | 'icon';
    as?: typeof Link;
    href?: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    target?: string;
    rel?: string;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'default', size = 'default', disabled, as: Component = 'button', href, method, target, rel, ...props }, ref) => {
        const baseStyles = 'inline-flex items-center justify-center gap-2 rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-500 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50';

        const variants = {
            default: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm',
            destructive: 'bg-red-600 text-white hover:bg-red-700 shadow-sm',
            outline: 'border border-stone-300 bg-white hover:bg-stone-100 dark:border-stone-700 dark:bg-stone-900 dark:hover:bg-stone-800',
            secondary: 'bg-stone-100 text-stone-900 hover:bg-stone-200 dark:bg-stone-800 dark:text-stone-100 dark:hover:bg-stone-700',
            ghost: 'hover:bg-stone-100 dark:hover:bg-stone-800',
            link: 'text-emerald-600 underline-offset-4 hover:underline',
        };

        const sizes = {
            default: 'h-10 px-4 py-2',
            sm: 'h-9 rounded-md px-3',
            lg: 'h-11 rounded-md px-8',
            icon: 'h-10 w-10',
        };

        const isLink = Component === Link;

        if (isLink && href) {
            const linkProps = props as Omit<InertiaLinkProps, 'href' | 'method' | 'children' | 'className'>;
            return (
                <Link
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    method={method}
                    target={target}
                    rel={rel}
                    className={cn(baseStyles, variants[variant], sizes[size], className)}
                    {...linkProps}
                />
            );
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[variant], sizes[size], className)}
                disabled={disabled}
                {...props}
            />
        );
    }
);

Button.displayName = 'Button';

export { Button };