"use client";

import { useState } from 'react';
import { router } from '@inertiajs/react';

type StringFilters = Record<string, string>;

function toQuery(values: StringFilters): Record<string, string> {
    return Object.fromEntries(
        Object.entries(values).filter(([, v]) => v !== '' && v !== undefined),
    );
}

export function useCrudFilters<T extends StringFilters>(indexUrl: string, initial: T) {
    const [values, setValues] = useState<T>(initial);

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
