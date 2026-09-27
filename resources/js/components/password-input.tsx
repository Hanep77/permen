import { Eye, EyeOff } from 'lucide-react';
import type { ComponentProps, Ref } from 'react';
import { useState } from 'react';
import { cn } from '@/lib/utils';

export default function PasswordInput({
    className,
    ref,
    ...props
}: Omit<ComponentProps<'input'>, 'type'> & { ref?: Ref<HTMLInputElement> }) {
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="relative">
            <input
                type={showPassword ? 'text' : 'password'}
                className={cn(
                    'w-full rounded-xs border border-outline bg-transparent px-4 py-3 pr-12 text-body-large text-on-surface transition outline-none placeholder:text-on-surface-variant/70 hover:border-on-surface focus:border-2 focus:border-primary dark:[color-scheme:dark]',
                    className,
                )}
                ref={ref}
                {...props}
            />
            <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-0 flex items-center rounded-full px-3 text-on-surface-variant transition hover:bg-on-surface/8 hover:text-on-surface focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
            >
                {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
            </button>
        </div>
    );
}
