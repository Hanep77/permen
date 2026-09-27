import { Link } from '@inertiajs/react';
import type { PropsWithChildren } from 'react';
import Heading from '@/components/heading';
import { useCurrentUrl } from '@/hooks/use-current-url';
import { cn, toUrl } from '@/lib/utils';
import { edit as editAppearance } from '@/routes/appearance';
import { edit } from '@/routes/profile';
import { edit as editSecurity } from '@/routes/security';
import type { NavItem } from '@/types';

const sidebarNavItems: NavItem[] = [
    {
        title: 'Profile',
        href: edit(),
        icon: null,
    },
    {
        title: 'Security',
        href: editSecurity(),
        icon: null,
    },
    {
        title: 'Appearance',
        href: editAppearance(),
        icon: null,
    },
];

export default function SettingsLayout({ children }: PropsWithChildren) {
    const { isCurrentOrParentUrl } = useCurrentUrl();

    return (
        <div className="bg-surface px-4 py-6 text-on-surface">
            <Heading
                title="Settings"
                description="Manage your profile and account settings"
            />

            <div className="flex flex-col gap-8 lg:flex-row">
                <aside className="w-full lg:w-60">
                    <nav
                        className="flex gap-1 overflow-x-auto rounded-md bg-surface-container-low p-2 lg:flex-col"
                        aria-label="Settings"
                    >
                        {sidebarNavItems.map((item, index) => (
                            <Link
                                key={`${toUrl(item.href)}-${index}`}
                                href={item.href}
                                className={cn(
                                    'h-12 shrink-0 rounded-full px-4 text-label-large transition inline-flex items-center',
                                    {
                                        'bg-secondary-container text-on-secondary-container':
                                            isCurrentOrParentUrl(item.href),
                                        'text-on-surface-variant hover:bg-on-surface/8':
                                            !isCurrentOrParentUrl(item.href),
                                    },
                                )}
                            >
                                {item.title}
                            </Link>
                        ))}
                    </nav>
                </aside>

                <div className="flex-1 md:max-w-2xl">
                    <section className="max-w-xl space-y-12">{children}</section>
                </div>
            </div>
        </div>
    );
}
