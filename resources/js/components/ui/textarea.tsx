"use client";

import { forwardRef, type TextareaHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string;
    error?: string;
    hint?: string;
}

const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, label, error, hint, id, required, ...props }, ref) => {
        const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-');

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={textareaId}
                        className="block text-label-medium text-on-surface-variant"
                    >
                        {label}
                        {required && <span className="ml-0.5 text-error">*</span>}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={textareaId}
                    required={required}
                    className={cn(
                        'flex min-h-[88px] w-full rounded-xs border border-outline bg-transparent px-4 py-3 text-body-large text-on-surface transition outline-none placeholder:text-on-surface-variant/70 hover:border-on-surface focus:border-2 focus:border-primary disabled:cursor-not-allowed disabled:opacity-50',
                        error &&
                            'border-error focus:border-error hover:border-error',
                        className,
                    )}
                    aria-invalid={error ? 'true' : 'false'}
                    aria-describedby={
                        error
                            ? `${textareaId}-error`
                            : hint
                              ? `${textareaId}-hint`
                              : undefined
                    }
                    {...props}
                />
                {error && (
                    <p
                        id={`${textareaId}-error`}
                        className="text-body-small text-error"
                        role="alert"
                    >
                        {error}
                    </p>
                )}
                {hint && !error && (
                    <p
                        id={`${textareaId}-hint`}
                        className="text-body-small text-on-surface-variant"
                    >
                        {hint}
                    </p>
                )}
            </div>
        );
    },
);

Textarea.displayName = 'Textarea';

export { Textarea };
