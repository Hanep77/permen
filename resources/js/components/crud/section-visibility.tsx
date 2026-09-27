"use client";

import { useEffect, useRef, useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SectionOption {
    id: string;
    label: string;
}

function readHiddenIds(storageKey: string, sectionIds: string[]): string[] {
    if (typeof window === 'undefined') {
        return [];
    }
    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            return [];
        }
        const parsed: unknown = JSON.parse(raw);
        if (!Array.isArray(parsed)) {
            return [];
        }
        return parsed.filter(
            (id): id is string => typeof id === 'string' && sectionIds.includes(id),
        );
    } catch {
        return [];
    }
}

export function useSectionVisibility(storageKey: string, sections: SectionOption[]) {
    const sectionIds = sections.map((s) => s.id);
    const [hiddenIds, setHiddenIds] = useState<string[]>(() => readHiddenIds(storageKey, sectionIds));

    useEffect(() => {
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(hiddenIds));
        } catch {
            // Storage unavailable (private mode, quota) — visibility just won't persist.
        }
    }, [storageKey, hiddenIds]);

    return {
        isVisible: (id: string) => !hiddenIds.includes(id),
        toggle: (id: string) =>
            setHiddenIds((prev) => (prev.includes(id) ? prev.filter((h) => h !== id) : [...prev, id])),
        showAll: () => setHiddenIds([]),
        hiddenCount: hiddenIds.length,
        allHidden: hiddenIds.length >= sections.length && sections.length > 0,
    };
}

export function SectionVisibilityMenu({
    sections,
    isVisible,
    onToggle,
    onShowAll,
    hiddenCount,
}: {
    sections: SectionOption[];
    isVisible: (id: string) => boolean;
    onToggle: (id: string) => void;
    onShowAll: () => void;
    hiddenCount: number;
}) {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!open) {
            return;
        }
        const handlePointerDown = (e: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
                setOpen(false);
            }
        };
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                setOpen(false);
            }
        };
        document.addEventListener('mousedown', handlePointerDown);
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.removeEventListener('mousedown', handlePointerDown);
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [open ]);

    return (
        <div ref={containerRef} className="relative">
            <Button
                variant="ghost"
                size="icon"
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                title="Choose visible sections"
                className="relative"
            >
                <SlidersHorizontal className="size-4" />
                {hiddenCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-emerald-600 text-[10px] font-semibold text-white">
                        {hiddenCount}
                    </span>
                )}
            </Button>

            {open && (
                <div
                    role="menu"
                    aria-label="Visible sections"
                    className="absolute top-full right-0 z-20 mt-2 w-56 rounded-lg border border-stone-200 bg-white p-1.5 shadow-lg dark:border-stone-700 dark:bg-stone-900"
                >
                    <p className="px-2.5 pt-1.5 pb-1 text-xs font-medium tracking-wide text-stone-500 uppercase dark:text-stone-400">
                        Sections
                    </p>
                    {sections.map((section) => {
                        const checked = isVisible(section.id);
                        return (
                            <label
                                key={section.id}
                                role="menuitemcheckbox"
                                aria-checked={checked}
                                className={cn(
                                    'flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors',
                                    'text-stone-700 hover:bg-stone-100 dark:text-stone-200 dark:hover:bg-stone-800',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggle(section.id)}
                                    className="size-4 shrink-0 accent-emerald-600"
                                />
                                {section.label}
                            </label>
                        );
                    })}
                    {hiddenCount > 0 && (
                        <button
                            type="button"
                            onClick={() => {
                                onShowAll();
                                setOpen(false);
                            }}
                            className="mt-1 w-full rounded-md px-2.5 py-2 text-left text-sm font-medium text-emerald-600 transition-colors hover:bg-stone-100 dark:text-emerald-400 dark:hover:bg-stone-800"
                        >
                            Show all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
