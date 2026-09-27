"use client";

import MDEditor from '@uiw/react-md-editor';
import '@uiw/react-markdown-preview/markdown.css';
import { useAppearance } from '@/hooks/use-appearance';
import { cn } from '@/lib/utils';

export function MarkdownContent({
    content,
    className,
}: {
    content: string;
    className?: string;
}) {
    const { resolvedAppearance } = useAppearance();

    if (!content) {
        return null;
    }

    return (
        <div data-color-mode={resolvedAppearance} className={cn('markdown-view', className)}>
            <MDEditor.Markdown source={content} />
        </div>
    );
}

/**
 * Strip Markdown syntax for single-line list previews
 * (index pages use line-clamp-1, so raw `**bold**` would look broken).
 */
export function stripMarkdown(source: string | null | undefined): string {
    if (!source) {
        return '';
    }

    return source
        .replace(/!\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
        .replace(/(\*\*|__)(.*?)\1/g, '$2')
        .replace(/(\*|_)(.*?)\1/g, '$2')
        .replace(/~~(.*?)~~/g, '$1')
        .replace(/`{1,3}([^`]*?)`{1,3}/g, '$1')
        .replace(/^#{1,6}\s+/gm, '')
        .replace(/^>\s?/gm, '')
        .replace(/^(\s*[-*+]|\s*\d+\.)\s+/gm, '')
        .replace(/^(\s*-\s\[[ xX]\]\s+)/gm, '')
        .replace(/^(-{3,}|\*{3,}|_{3,})\s*$/gm, '')
        .replace(/\|/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();
}
