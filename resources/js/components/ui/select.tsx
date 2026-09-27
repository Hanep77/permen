"use client";

import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface SelectOption {
    value: string;
    label: string;
}

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
    label?: string;
    error?: string;
    hint?: string;
    options: SelectOption[];
    placeholder?: string;
}

const Select = forwardRef<HTMLSelectElement, SelectProps>(
    ({ className, label, error, hint, options, placeholder, id, required, ...props }, ref) => {
        const selectId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={selectId}
                        className="block text-label-medium text-on-surface-variant"
                    >
                        {label}
                        {required && <span className="ml-0.5 text-error">*</span>}
                    </label>
                )}
                <select
                    ref={ref}
                    id={selectId}
                    required={required}
                    className={cn(
                        'flex h-12 w-full rounded-xs border border-outline bg-transparent px-4 text-body-large text-on-surface transition outline-none hover:border-on-surface focus:border-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                        error &&
                            'border-error focus:border-error hover:border-error',
                        className,
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${selectId}-error`
                            : hint
                              ? `${selectId}-hint`
                              : undefined
                    }
                    {...props}
                >
                    {placeholder && (
                        <option value="" disabled>
                            {placeholder}
                        </option>
                    )}
                    {options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    ))}
                </select>
                {error && (
                    <p
                        id={`${selectId}-error`}
                        className="text-body-small text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${selectId}-hint`}
                        className="text-body-small text-on-surface-variant"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Select.displayName = 'Select';

export { Select };
