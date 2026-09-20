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
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" aria-labelledby="dialog-title">
            <div
                ref={overlayRef}
                className="fixed inset-0 bg-black/50 animate-in fade-in-0"
                onClick={onClose}
            />
            <div
                ref={contentRef}
                className={cn(
                    'fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md rounded-lg bg-white p-6 shadow-xl animate-in zoom-in-95 fade-in-0 dark:bg-stone-900',
                    'sm:max-w-lg'
                )}
            >
                <div className="flex items-start justify-between">
                    <div>
                        <h2 id="dialog-title" className="text-lg font-semibold text-stone-900 dark:text-stone-100">
                            {title}
                        </h2>
                        <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1 text-stone-400 hover:text-stone-600 hover:bg-stone-100 dark:hover:bg-stone-800"
                        aria-label="Close"
                    >
                        <X className="size-4" />
                    </button>
                </div>
                <div className="mt-6 flex justify-end gap-3">
                    <Button variant="ghost" onClick={onClose} disabled={isLoading}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant}
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