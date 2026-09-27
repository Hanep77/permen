"use client";

import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export interface MarkdownEditorProps {
    label?: string;
    value: string;
    onChange: (value: string) => void;
    error?: string;
    hint?: string;
    placeholder?: string;
    required?: boolean;
    height?: number;
    preview?: 'live' | 'edit' | 'preview';
    id?: string;
}

export function MarkdownEditor({
    label,
    value,
    onChange,
    error,
    hint,
    placeholder = 'Write in Markdown…',
    required,
    height = 240,
    preview = 'live',
    id,
}: MarkdownEditorProps) {
    const { resolvedAppearance } = useAppearance();
    const editorId = id || label?.toLowerCase().replace(/\s+/g, '-');

    return (
        <div className="space-y-1.5" data-color-mode={resolvedAppearance}>
            {label && (
                <label
                    htmlFor={editorId}
                    className="block text-sm font-medium text-stone-700 dark:text-stone-300"
                >
                    {label}
                    {required && <span className="ml-0.5 text-red-500">*</span>}
                </label>
            )}
            <div
                id={editorId}
                className={cn(
                    'markdown-editor-wrapper overflow-hidden rounded-md border border-stone-300 bg-white dark:border-stone-700 dark:bg-stone-900',
                    error && 'border-red-500 dark:border-red-500',
                )}
            >
                <MDEditor
                    value={value}
                    onChange={(next) => onChange(next ?? '')}
                    height={height}
                    preview={preview}
                    textareaProps={{
                        placeholder,
                        required,
                    }}
                />
            </div>
            {error && (
                <p id={`${editorId}-error`} className="text-sm text-red-600 dark:text-red-400" role="alert">
                    {error}
                </p>
            )}
            {hint && !error && (
                <p id={`${editorId}-hint`} className="text-sm text-stone-500 dark:text-stone-400">
                    {hint}
                </p>
            )}
        </div>
    );
}
