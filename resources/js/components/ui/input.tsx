"use client";

import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Input = forwardRef<HTMLInputElement, InputProps>(
    ({ className, label, error, hint, id, required, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-label-medium text-on-surface-variant"
                    >
                        {label}
                        {required && <span className="ml-0.5 text-error">*</span>}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    required={required}
                    className={cn(
                        // M3 outlined text field: 4px shape, 1px outline, 2px primary on focus
                        'flex h-12 w-full rounded-xs border border-outline bg-transparent px-4 text-body-large text-on-surface transition outline-none placeholder:text-on-surface-variant/70 hover:border-on-surface focus:border-2 focus:border-primary disabled:cursor-not-allowed disabled:border-on-surface/20 disabled:bg-on-surface/5 disabled:text-on-surface/40',
                        error &&
                            'border-error focus:border-error hover:border-error',
                        className,
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${inputId}-error`
                            : hint
                              ? `${inputId}-hint`
                              : undefined
                    }
                    {...props}
                />
                {error && (
                    <p
                        id={`${inputId}-error`}
                        className="text-body-small text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${inputId}-hint`}
                        className="text-body-small text-on-surface-variant"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Input.displayName = 'Input';

export { Input };
