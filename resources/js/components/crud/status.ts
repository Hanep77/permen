"use client";

import type { BadgeProps } from '@/components/ui/badge';
import type { FilterOption } from './types';

type BadgeVariant = NonNullable<BadgeProps['variant']>;

export function formatLabel(value: string): string {
    return value
        .replace(/_/g, ' ')
        .replace(/\b\w/g, (l) => l.toUpperCase());
}

export function variantFor(
    value: string,
    map: Record<string, BadgeVariant>,
    fallback: BadgeVariant = 'secondary',
): BadgeVariant {
    return map[value] ?? fallback;
}

const commonProjectStatusVariants: Record<string, BadgeVariant> = {
    active: 'default',
    completed: 'success',
    abandoned: 'destructive',
};

const todoStatusVariants: Record<string, BadgeVariant> = {
    in_progress: 'default',
    completed: 'success',
    cancelled: 'destructive',
};

const opportunityStatusVariants: Record<string, BadgeVariant> = {
    won: 'success',
    persuing: 'default',
    considering: 'warning',
    rejected: 'destructive',
    expired: 'destructive',
};

const priorityVariants: Record<string, BadgeVariant> = {
    high: 'destructive',
    medium: 'warning',
};

export const statusVariants = {
    project: commonProjectStatusVariants,
    goal: commonProjectStatusVariants,
    todo: todoStatusVariants,
    opportunity: opportunityStatusVariants,
    priority: priorityVariants,
};

export const statusOptions: FilterOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'draft', label: 'Draft' },
    { value: 'active', label: 'Active' },
    { value: 'completed', label: 'Completed' },
    { value: 'abandoned', label: 'Abandoned' },
];

export const todoStatusOptions: FilterOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'todo', label: 'To Do' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' },
];

export const opportunityStatusOptions: FilterOption[] = [
    { value: '', label: 'All Statuses' },
    { value: 'new', label: 'New' },
    { value: 'considering', label: 'Considering' },
    { value: 'persuing', label: 'Pursuing' },
    { value: 'won', label: 'Won' },
    { value: 'rejected', label: 'Rejected' },
    { value: 'expired', label: 'Expired' },
];

export const priorityOptions: FilterOption[] = [
    { value: '', label: 'All Priorities' },
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' },
];

export const scopeOptions: FilterOption[] = [
    { value: 'independent', label: 'Independent' },
    { value: 'all', label: 'All' },
];

export const resourceTypeOptions: FilterOption[] = [
    { value: '', label: 'All Types' },
    { value: 'book', label: 'Book' },
    { value: 'course', label: 'Course' },
    { value: 'tutorial', label: 'Tutorial' },
    { value: 'paper', label: 'Paper' },
    { value: 'article', label: 'Article' },
    { value: 'video', label: 'Video' },
    { value: 'documentation', label: 'Documentation' },
    { value: 'website', label: 'Website' },
    { value: 'other', label: 'Other' },
];
