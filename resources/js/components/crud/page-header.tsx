"use client";

import { Link } from '@inertiajs/react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface CrudPageHeaderProps {
    title: string;
    description: string;
    createHref: string;
    createLabel: string;
}

export function CrudPageHeader({ title, description, createHref, createLabel }: CrudPageHeaderProps) {
    return (
        <div className="flex items-center justify-between">
            <div>
                <h1 className="text-3xl font-semibold tracking-tight">{title}</h1>
                <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">{description}</p>
            </div>
            <Button as={Link} href={createHref}>
                <Plus className="size-4" />
                {createLabel}
            </Button>
        </div>
    );
}
