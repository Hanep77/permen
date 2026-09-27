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
                variant="text"
                size="icon"
                type="button"
                onClick={() => setOpen((v) => !v)}
                aria-haspopup="menu"
                aria-expanded={open}
                title="Choose visible sections"
                className="relative"
            >
                <SlidersHorizontal className="size-5" />
                {hiddenCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 flex size-4 items-center justify-center rounded-full bg-error text-[10px] font-semibold text-on-error">
                        {hiddenCount}
                    </span>
                )}
            </Button>

            {open && (
                <div
                    role="menu"
                    aria-label="Visible sections"
                    className="absolute top-full right-0 z-20 mt-2 w-56 rounded-md bg-surface-container-high p-2 shadow-[0_2px_6px_2px_rgb(0_0_0/0.15),0_1px_2px_rgb(0_0_0/0.3)]"
                >
                    <p className="px-3 pt-1.5 pb-1 text-title-small text-on-surface-variant">
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
                                    'flex cursor-pointer items-center gap-3 rounded-full px-3 py-2 text-body-large transition-colors',
                                    'text-on-surface hover:bg-on-surface/8',
                                )}
                            >
                                <input
                                    type="checkbox"
                                    checked={checked}
                                    onChange={() => onToggle(section.id)}
                                    className="size-[18px] shrink-0 accent-primary"
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
                            className="mt-1 w-full rounded-full px-3 py-2 text-left text-label-large text-primary transition-colors hover:bg-primary/8"
                        >
                            Show all
                        </button>
                    )}
                </div>
            )}
        </div>
    );
}
