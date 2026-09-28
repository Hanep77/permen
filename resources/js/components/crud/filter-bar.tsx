"use client";

import { ChevronDown, Filter, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import type { FilterOption } from './types';

export interface FilterField {
    value: string;
    onChange: (value: string) => void;
    options: FilterOption[];
    placeholder: string;
    widthClassName?: string;
}

interface CrudFilterBarProps {
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    fields?: FilterField[];
    onSubmit: (e: React.FormEvent) => void;
}

export function CrudFilterBar({
    searchValue,
    onSearchChange,
    searchPlaceholder,
    fields = [],
    onSubmit,
}: CrudFilterBarProps) {
    return (
        <form onSubmit={onSubmit} className="flex flex-col gap-3 sm:flex-row sm:items-start">
            <div className="relative flex-1">
                {/* M3 search bar: pill + surface-container-highest */}
                <Search className="absolute top-1/2 left-4 size-5 -translate-y-1/2 text-on-surface-variant" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="h-14 rounded-full border-0 bg-surface-container-highest pr-4 pl-12 hover:bg-surface-container-highest focus:border-primary"
                />
            </div>
            {fields.map((field) => (
                <div key={field.placeholder} className="relative">
                    <Filter className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-on-surface-variant" />
                    <Select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        options={field.options}
                        placeholder={field.placeholder}
                        className={cn(
                            'h-14 appearance-none rounded-full border-outline-variant pr-12 pl-12',
                            field.widthClassName ?? 'w-full sm:w-50',
                        )}
                    />
                    <ChevronDown className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-on-surface-variant" />
                </div>
            ))}
        </form>
    );
}
