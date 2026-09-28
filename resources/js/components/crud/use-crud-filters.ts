"use client";

import { useEffect, useRef, useState } from 'react';
import { router } from '@inertiajs/react';

type StringFilters = Record<string, string>;

function toQuery(values: StringFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
}

function isEmptyFilters(values: StringFilters): boolean {
    return Object.values(values).every((v) => v === '' || v === undefined);
}

function readSavedFilters<T extends StringFilters>(storageKey: string, initial: T): T {
    if (typeof window === 'undefined') {
        return initial;
    }
    try {
        const raw = window.localStorage.getItem(storageKey);
        if (!raw) {
            return initial;
        }
        const parsed: unknown = JSON.parse(raw);
        if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
            return initial;
        }
        const next = { ...initial };
        for (const key of Object.keys(next)) {
            const v = (parsed as Record<string, unknown>)[key];
            if (typeof v === 'string') {
                (next as Record<string, string>)[key] = v;
            }
        }
        return next;
    } catch {
        return initial;
    }
}

function hasQueryFilters(keys: string[]): boolean {
    if (typeof window === 'undefined') {
        return false;
    }
    const params = new URLSearchParams(window.location.search);
    return keys.some((key) => params.has(key));
}

export function useCrudFilters<T extends StringFilters>(
    indexUrl: string,
    initial: T,
    storageKey?: string,
) {
    const [values, setValues] = useState<T>(() => {
        // Plain navigation (no filter params in the URL) — restore saved filters.
        // An explicit query (shared link, pagination, back button) always wins.
        if (storageKey && !hasQueryFilters(Object.keys(initial))) {
            return readSavedFilters(storageKey, initial);
        }
        return initial;
    });

    const restoredRef = useRef(false);

    // Persist every change so filters survive navigation and reloads.
    useEffect(() => {
        if (!storageKey) {
            return;
        }
        try {
            window.localStorage.setItem(storageKey, JSON.stringify(values));
        } catch {
            // Storage unavailable (private mode, quota) — filters just won't persist.
        }
    }, [storageKey, values]);

    // On mount, if we restored saved filters, fetch the matching list from the server.
    useEffect(() => {
        if (!storageKey || restoredRef.current) {
            return;
        }
        restoredRef.current = true;
        if (!hasQueryFilters(Object.keys(initial)) && !isEmptyFilters(values)) {
            router.get(indexUrl, toQuery(values as StringFilters), {
                preserveState: true,
                preserveScroll: true,
                replace: true,
            });
        }
        // Intentionally runs once on mount.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const submit = (e?: React.FormEvent, overrides?: Partial<T>) => {
        e?.preventDefault();
        const next = { ...values, ...overrides } as T;
        setValues(next);
        router.get(indexUrl, toQuery(next as StringFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    const set = (key: keyof T, value: string) => {
        setValues((prev) => ({ ...prev, [key]: value }) as T);
    };

    const update = (key: keyof T, value: string) => {
        const next = { ...values, [key]: value } as T;
        setValues(next);
        router.get(indexUrl, toQuery(next as StringFilters), {
            preserveState: true,
            preserveScroll: true,
            replace: true,
        });
    };

    return { values, set, update, submit };
}
