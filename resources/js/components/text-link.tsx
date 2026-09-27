import { Link } from '@inertiajs/react';
import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

type Props = ComponentProps<typeof Link>;

export default function TextLink({ className = '', children, ...props }: Props) {
    return (
        <Link
            className={cn(
                'text-primary underline decoration-primary/40 underline-offset-4 transition-colors duration-200 ease-out hover:bg-primary/8 hover:decoration-current rounded-xs',
                className,
            )}
            {...props}
        >
            {children}
        </Link>
    );
}
