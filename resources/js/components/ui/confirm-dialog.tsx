"use client";

import { X } from 'lucide-react';
import { Button } from './button';
import { cn } from '@/lib/utils';
import { useEffect, useRef } from 'react';

interface ConfirmDialogProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    variant?: 'default' | 'destructive';
    isLoading?: boolean;
}

export function ConfirmDialog({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    variant = 'default',
    isLoading = false,
}: ConfirmDialogProps) {
    const overlayRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div
            className="fixed inset-0 z-50"
            role="dialog"
            aria-modal="true"
            aria-labelledby="dialog-title"
        >
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-scrim/40 animate-in fade-in-0"
                onClick={onClose}
            />
            <div
                ref={contentRef}
                className={cn(
                    'fixed left-1/2 top-1/2 w-full max-w-md -translate-x-1/2 -translate-y-1/2 rounded-md bg-surface-container-high p-6 shadow-[0_4px_8px_3px_rgb(0_0_0/0.15),0_1px_3px_rgb(0_0_0/0.3)] animate-in zoom-in-95 fade-in-0',
                    'sm:max-w-lg',
                )}
            >
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h2
                            id="dialog-title"
                            className="text-headline-small text-on-surface"
                        >
                            {title}
                        </h2>
                        <p className="mt-2 text-body-medium text-on-surface-variant">
                            {description}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-on-surface-variant transition hover:bg-on-surface/8"
                        aria-label="Close"
                    >
                        <X className="size-5" />
                    </button>
                </div>
                <div className="mt-6 flex justify-end gap-2">
                    <Button variant="text" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === 'destructive' ? 'destructive' : 'filled'}
                        onClick={onConfirm}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Processing...' : confirmText}
                    </Button>
                </div>
            </div>
        </div>
    );
}
