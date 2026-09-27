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
        <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
                <h1 className="text-headline-small text-on-surface">{title}</h1>
                <p className="mt-1 text-body-medium text-on-surface-variant">{description}</p>
            </div>
            {/* M3 extended FAB */}
            <Button as={Link} href={createHref} size="default" className="rounded-fulli text-white dark:text-black shadow-[0_1px_2px_rgb(0_0_0/0.3),0_1px_3px_1px_rgb(0_0_0/0.15)]">
                <Plus className="size-5" />
                {createLabel}
            </Button>
        </div>
    );
}
