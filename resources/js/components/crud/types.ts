"use client";

export interface PaginationLink {
    url: string | null;
    label: string;
    active: boolean;
}

export interface Paginated<T> {
    data: T[];
    links: PaginationLink[];
}

export interface FilterOption {
    value: string;
    label: string;
}

export interface RelatedRef {
    id: number;
    title: string;
}
