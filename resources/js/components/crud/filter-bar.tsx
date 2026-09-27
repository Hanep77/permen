"use client";

import { Filter, Search } from 'lucide-react';
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
        <form onSubmit={onSubmit} className="flex flex-col gap-4 sm:flex-row">
            <div className="relative flex-1">
                <Search className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
                <Input
                    placeholder={searchPlaceholder}
                    value={searchValue}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="pl-10"
                />
            </div>
            {fields.map((field) => (
                <div key={field.placeholder} className="relative">
                    <Filter className="absolute top-1/2 left-3 size-4 -translate-y-1/2 text-stone-400" />
                    <Select
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                        options={field.options}
                        placeholder={field.placeholder}
                        className={cn('pl-10', field.widthClassName ?? 'w-[180px]')}
                    />
                </div>
            ))}
        </form>
    );
}
