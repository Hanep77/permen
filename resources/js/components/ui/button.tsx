"use client";

import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { Link, type InertiaLinkProps } from '@inertiajs/react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    // M3 button styles. Legacy shadcn aliases kept for compat:
    // default -> filled, secondary -> tonal, ghost -> text, outline -> outlined, link -> text
    variant?:
        | 'filled'
        | 'tonal'
        | 'outlined'
        | 'text'
        | 'elevated'
        | 'destructive'
        | 'default'
        | 'secondary'
        | 'outline'
        | 'ghost'
        | 'link';
    size?: 'xs' | 'sm' | 'default' | 'lg' | 'icon';
    as?: typeof Link;
    href?: string;
    method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
    target?: string;
    rel?: string;
}

const variantAlias: Record<string, string> = {
    default: 'filled',
    secondary: 'tonal',
    ghost: 'text',
    outline: 'outlined',
    link: 'text',
};

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    (
        {
            className,
            variant = 'filled',
            size = 'default',
            disabled,
            as: Component = 'button',
            href,
            method,
            target,
            rel,
            ...props
        },
        ref,
    ) => {
        const resolved = variantAlias[variant] ?? variant;

        const baseStyles =
            'inline-flex items-center justify-center gap-2 rounded-full text-label-large font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-surface disabled:pointer-events-none disabled:opacity-38 active:scale-[0.98]';

        const variants: Record<string, string> = {
            // M3 filled button: primary / on-primary, hover state layer + elevation 1
            filled: 'bg-primary text-on-primary shadow-none hover:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] hover:brightness-[1.08] dark:hover:brightness-[1.15]',
            // M3 tonal button: secondary-container
            tonal: 'bg-secondary-container text-on-secondary-container hover:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] hover:brightness-[1.03]',
            // M3 outlined button
            outlined:
                'border border-outline bg-transparent text-primary hover:bg-primary/8 focus:bg-primary/10',
            // M3 text button
            text: 'bg-transparent text-primary hover:bg-primary/8 focus:bg-primary/10 px-3',
            // M3 elevated button
            elevated:
                'bg-surface-container-low text-primary shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] hover:bg-surface-container-low hover:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_2px_6px_2px_rgb(0_0_0/0.15)]',
            // M3 error filled
            destructive: 'bg-error text-on-error hover:shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)] hover:brightness-[1.06]',
        };

        const sizes = {
            xs: 'h-8 px-4 text-label-medium [&_svg]:size-4',
            sm: 'h-9 px-4 [&_svg]:size-4',
            default: 'h-10 px-6 [&_svg]:size-[18px]',
            lg: 'h-14 px-8 text-body-large [&_svg]:size-5',
            icon: 'h-10 w-10 [&_svg]:size-5',
        };

        const isLink = Component === Link;

        if (isLink && href) {
            const linkProps = props as Omit<
                InertiaLinkProps,
                'href' | 'method' | 'children' | 'className'
            >;
            return (
                <Link
                    ref={ref as React.Ref<HTMLAnchorElement>}
                    href={href}
                    method={method}
                    target={target}
                    rel={rel}
                    className={cn(
                        baseStyles,
                        variants[resolved],
                        sizes[size],
                        // link alias gets underline affordance
                        variant === 'link' && 'underline-offset-4 hover:underline',
                        className,
                    )}
                    {...linkProps}
                />
            );
        }

        return (
            <button
                ref={ref}
                className={cn(baseStyles, variants[resolved], sizes[size], className)}
                disabled={disabled}
                {...props}
            />
        );
    },
);

Button.displayName = 'Button';

export { Button };
