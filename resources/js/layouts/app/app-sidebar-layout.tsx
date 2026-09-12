import { Link, usePage } from '@inertiajs/react';
import { LayoutDashboard, LogOut, Settings } from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { dashboard, logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { AppLayoutProps } from '@/types';

export default function AppSidebarLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <header className="border-b border-stone-200 bg-white/90 backdrop-blur dark:border-stone-800 dark:bg-stone-950/90">
                <div className="mx-auto flex h-16 max-w-6xl items-center gap-6 px-4 sm:px-6">
                    <Link
                        href={dashboard()}
                        className="flex items-center gap-3"
                    >
                        <AppLogo />
                    </Link>
                    <nav
                        className="flex items-center gap-1 text-sm font-medium"
                        aria-label="Main navigation"
                    >
                        <Link
                            href={dashboard()}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <LayoutDashboard className="size-4" />
                            Dashboard
                        </Link>
                        <Link
                            href={editProfile()}
                            className="inline-flex items-center gap-2 rounded-md px-3 py-2 transition hover:bg-stone-100 dark:hover:bg-stone-800"
                        >
                            <Settings className="size-4" />
                            Settings
                        </Link>
                    </nav>
                    <div className="ml-auto flex items-center gap-3 text-sm">
                        <span className="hidden text-stone-500 sm:inline">
                            {usePage().props.auth.user?.name}
                        </span>
                        <Link
                            href={logout()}
                            method="post"
                            as="button"
                            className="inline-flex items-center gap-2 rounded-md border border-stone-300 px-3 py-2 font-medium transition hover:bg-stone-100 dark:border-stone-700 dark:hover:bg-stone-800"
                        >
                            <LogOut className="size-4" />
                            <span className="hidden sm:inline">Log out</span>
                        </Link>
                    </div>
                </div>
            </header>
            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6">
                {breadcrumbs && breadcrumbs.length > 0 && (
                    <p className="mb-6 text-sm text-stone-500">
                        {breadcrumbs[breadcrumbs.length - 1].title}
                    </p>
                )}
                {children}
            </main>
        </div>
    );
}
