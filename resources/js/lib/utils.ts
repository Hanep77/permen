import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function toUrl(path: string | { url: string }): string {
    return typeof path === 'string' ? path : path.url;
}

/**
 * Normalize a server datetime value for `<input type="date">`,
 * which only accepts `YYYY-MM-DD`. Eloquent datetime/date casts
 * serialize as full ISO strings (e.g. `2026-10-05T00:00:00.000000Z`),
 * which the input would reject and render empty.
 */
export function toDateInputValue(value: string | null | undefined): string {
    if (!value) {
        return '';
    }
    return value.slice(0, 10);
}