'use client';

import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Settings,
    Users,
    BarChart2,
    FileText,
    LogOut,
    Menu,
    X,
    ChevronRight,
    PanelLeft,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { dashboard, logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import type { AppLayoutProps } from '@/types';

const navigation = [
    { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
    { title: 'Analytics', href: '#', icon: BarChart2 },
    { title: 'Users', href: '#', icon: Users },
    { title: 'Reports', href: '#', icon: FileText },
    { title: 'Settings', href: editProfile(), icon: Settings },
];

export default function AppSidebarDashboardLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-stone-50 text-stone-900 dark:bg-stone-950 dark:text-stone-100">
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col transition-all duration-300 ease-in-out border-r border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-950 ${isSidebarCollapsed ? 'w-16' : 'w-64'
                    } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                aria-label="Sidebar"
            >
                <div className="flex h-16 items-center justify-between border-b border-stone-200 px-4 dark:border-stone-800">
                    <Link
                        href={dashboard()}
                        className="flex items-center gap-3"
                        aria-label="Go to dashboard"
                    >
                        <AppLogo />
                    </Link>
                    <button
                        className="lg:hidden p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="size-5" />
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1" aria-label="Main navigation">
                    {navigation.map((item) => (
                        <Link
                            key={item.title}
                            href={item.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${isSidebarCollapsed
                                ? 'justify-center'
                                : 'justify-start'
                                } ${usePage().url.startsWith(item.href) && item.href !== '#'
                                    ? 'bg-stone-100 text-stone-900 dark:bg-stone-800 dark:text-stone-100'
                                    : 'text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800'
                                }`}
                            title={isSidebarCollapsed ? item.title : undefined}
                        >
                            <item.icon className="size-5 flex-shrink-0" aria-hidden="true" />
                            {!isSidebarCollapsed && <span className="truncate">{item.title}</span>}
                        </Link>
                    ))}
                </nav>

                <div className="border-t border-stone-200 p-3 dark:border-stone-800">
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-stone-600 hover:bg-stone-100 dark:text-stone-400 dark:hover:bg-stone-800 transition-colors ${isSidebarCollapsed ? 'justify-center' : 'justify-start'
                            }`}
                        title={isSidebarCollapsed ? 'Log out' : undefined}
                    >
                        <LogOut className="size-5 flex-shrink-0" aria-hidden="true" />
                        {!isSidebarCollapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>

            <div className={`transition-all duration-300 ease-in-out ${isSidebarOpen || isSidebarCollapsed ? 'lg:pl-16' : 'lg:pl-64'}`}>
                <header className="sticky top-0 z-40 flex h-16 items-center gap-4 border-b border-stone-200 bg-white/90 backdrop-blur px-4 dark:border-stone-800 dark:bg-stone-950/90 lg:px-6">
                    <button
                        className="lg:hidden p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu className="size-6" />
                    </button>

                    <button
                        className="hidden lg:block p-2 rounded-md text-stone-500 hover:bg-stone-100 dark:hover:bg-stone-800"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        aria-label="Open sidebar"
                    >
                        <PanelLeft className="size-4" />
                    </button>

                    <div className="flex-1" />
                    <div className="flex items-center gap-3 text-sm">
                        <span className="hidden text-stone-500 sm:inline">
                            {usePage().props.auth.user?.name}
                        </span>
                    </div>
                </header>

                <main className="p-4 sm:p-6 lg:p-8">
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="mb-6" aria-label="Breadcrumb">
                            <ol className="flex items-center gap-2 text-sm text-stone-500">
                                {breadcrumbs.map((crumb, index) => (
                                    <li key={crumb.title} className="flex items-center gap-2">
                                        {index > 0 && (
                                            <span className="text-stone-300 dark:text-stone-700" aria-hidden="true">
                                                /
                                            </span>
                                        )}
                                        {index === breadcrumbs.length - 1 ? (
                                            <span className="font-medium text-stone-900 dark:text-stone-100">
                                                {crumb.title}
                                            </span>
                                        ) : (
                                            <Link
                                                href={crumb.href}
                                                className="hover:text-stone-700 dark:hover:text-stone-300"
                                            >
                                                {crumb.title}
                                            </Link>
                                        )}
                                    </li>
                                ))}
                            </ol>
                        </nav>
                    )}
                    {children}
                </main>
            </div>

            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
