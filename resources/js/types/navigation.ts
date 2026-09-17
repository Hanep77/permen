import type { InertiaLinkProps } from '@inertiajs/react';
import type { LucideIcon } from 'lucide-react';

type Href = NonNullable<InertiaLinkProps['href']>;

export function extractHref(href: Href): string {
    if (typeof href === 'string') return href;
    return href.url;
}

export type BreadcrumbItem = {
    title: string;
    href: Href;
};

export type NavItem = {
    title: string;
    href: Href;
    icon?: LucideIcon | null;
    isActive?: boolean;
    getHref?: () => string;
};

export interface NavSection {
    section_title: string;
    items: NavItem[];
}

export type Navigation = NavSection[];
