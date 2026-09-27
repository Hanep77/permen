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
                    className="block text-label-medium text-on-surface-variant"
                >
                    {label}
                    {required && <span className="ml-0.5 text-error">*</span>}
                </label>
            )}
            <div
                id={editorId}
                className={cn(
                    'markdown-editor-wrapper overflow-hidden rounded-xs border border-outline bg-transparent',
                    error && 'border-error',
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
                <p id={`${editorId}-error`} className="text-body-small text-error" role="alert">
                    {error}
                </p>
            )}
            {hint && !error && (
                <p id={`${editorId}-hint`} className="text-body-small text-on-surface-variant">
                    {hint}
                </p>
            )}
        </div>
    );
}
