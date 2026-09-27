import { useState } from 'react';
import { Link, usePage } from '@inertiajs/react';
import {
    LayoutDashboard,
    Settings,
    LogOut,
    Menu,
    X,
    PanelLeft,
    Mail,
    CircleCheck,
    SquareTerminal,
    Calendar,
    Flag,
    Target,
    Repeat2,
    BookOpen,
    FileQuestion,
    Wallet,
    Users,
    NotepadText,
    Folder,
    NotepadTextDashed,
    Briefcase,
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { dashboard, logout } from '@/routes';
import { edit as editProfile } from '@/routes/profile';
import goals from '@/routes/goals';
import projects from '@/routes/projects';
import opportunities from '@/routes/opportunities';
import todos from '@/routes/todos';
import notes from '@/routes/notes';
import resources from '@/routes/resources';
import learningItems from '@/routes/learning-items';
import type { AppLayoutProps, Navigation } from '@/types';
import { extractHref } from '@/types/navigation';

const navigation: Navigation = [
    {
        section_title: 'overview',
        items: [
            { title: 'Dashboard', href: dashboard(), icon: LayoutDashboard },
            { title: 'Inbox', href: '#', icon: Mail },
        ],
    },
    {
        section_title: 'Execution',
        items: [
            { title: 'Todos', href: todos.index(), icon: CircleCheck },
            { title: 'Projects', href: projects.index(), icon: SquareTerminal },
            { title: 'Schedules', href: '#', icon: Calendar },
            { title: 'Events', href: '#', icon: Flag },
        ],
    },
    {
        section_title: 'Development',
        items: [
            { title: 'Goals', href: goals.index(), icon: Target },
            { title: 'Habbits', href: '#', icon: Repeat2 },
            { title: 'Learning Items', href: learningItems.index(), icon: BookOpen },
            { title: 'Question Banks', href: '#', icon: FileQuestion },
        ],
    },
    {
        section_title: 'Life',
        items: [
            { title: 'Finance', href: '#', icon: Wallet },
            { title: 'People', href: '#', icon: Users },
            { title: 'Opportunities', href: opportunities.index(), icon: Briefcase },
        ],
    },
    {
        section_title: 'Knowledge',
        items: [
            { title: 'Notes', href: notes.index(), icon: NotepadText },
            { title: 'Resources', href: resources.index(), icon: Folder },
            { title: 'Journal', href: '#', icon: NotepadTextDashed },
        ],
    },
    {
        section_title: 'Others',
        items: [{ title: 'Settings', href: editProfile(), icon: Settings }],
    },
];

export default function AppSidebarDashboardLayout({
    children,
    breadcrumbs,
}: AppLayoutProps) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const page = usePage();

    return (
        <div className="min-h-screen bg-surface text-on-surface">
            {/* M3 modal + standard navigation drawer */}
            <aside
                className={`fixed inset-y-0 left-0 z-50 flex flex-col rounded-r-lg bg-surface-container-low transition-all duration-300 ease-in-out ${
                    isSidebarCollapsed ? 'w-20' : 'w-80'
                } ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
                aria-label="Sidebar"
            >
                <div className="flex h-16 items-center justify-between px-4">
                    <Link
                        href={dashboard()}
                        className="flex items-center gap-3 rounded-full p-1"
                        aria-label="Go to dashboard"
                    >
                        <AppLogo />
                    </Link>
                    <button
                        className="rounded-full p-2 text-on-surface-variant transition hover:bg-on-surface/8 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                        aria-label="Close sidebar"
                    >
                        <X className="size-6" />
                    </button>
                </div>

                <nav
                    className="m3-drawer-scroll flex-1 space-y-1 overflow-y-auto px-3 py-4"
                    aria-label="Main navigation"
                >
                    {navigation.map((section) => (
                        <div key={section.section_title} className="mb-2">
                            {!isSidebarCollapsed && (
                                <div className="px-4 pt-2 pb-1 text-title-small capitalize text-on-surface-variant">
                                    {section.section_title}
                                </div>
                            )}
                            {section.items.map((item) => {
                                const itemHref = extractHref(item.href);
                                const isActive =
                                    itemHref === page.url && itemHref !== '#';
                                const isDisabled = item.href == '#';
                                return (
                                    <Link
                                        key={item.title}
                                        href={item.href}
                                        className={`flex h-14 items-center gap-3 rounded-full px-4 text-label-large transition-colors ${
                                            isSidebarCollapsed
                                                ? 'justify-center'
                                                : 'justify-start'
                                        } ${
                                            isActive
                                                ? 'bg-secondary-container text-on-secondary-container'
                                                : isDisabled
                                                  ? 'cursor-default text-on-surface/40'
                                                  : 'text-on-surface-variant hover:bg-on-surface/8'
                                        }`}
                                        title={
                                            isSidebarCollapsed ? item.title : undefined
                                        }
                                    >
                                        {item.icon && (
                                            <item.icon
                                                className="size-6 shrink-0"
                                                aria-hidden="true"
                                            />
                                        )}
                                        {!isSidebarCollapsed && (
                                            <span className="truncate">{item.title}</span>
                                        )}
                                    </Link>
                                );
                            })}
                        </div>
                    ))}
                </nav>

                <div className="p-3">
                    <Link
                        href={logout()}
                        method="post"
                        as="button"
                        className={`flex h-14 w-full items-center gap-3 rounded-full px-4 text-label-large text-on-surface-variant transition-colors hover:bg-on-surface/8 ${
                            isSidebarCollapsed ? 'justify-center' : 'justify-start'
                        }`}
                        title={isSidebarCollapsed ? 'Log out' : undefined}
                    >
                        <LogOut className="size-6 shrink-0" aria-hidden="true" />
                        {!isSidebarCollapsed && <span>Log out</span>}
                    </Link>
                </div>
            </aside>

            <div
                className={`transition-all duration-300 ease-in-out ${
                    isSidebarOpen || isSidebarCollapsed ? 'lg:pl-20' : 'lg:pl-80'
                }`}
            >
                {/* M3 small top app bar */}
                <header className="sticky top-0 z-40 flex h-16 items-center gap-2 bg-surface-container px-4 text-on-surface lg:px-6">
                    <button
                        className="rounded-full p-2 text-on-surface-variant transition hover:bg-on-surface/8 lg:hidden"
                        onClick={() => setIsSidebarOpen(true)}
                        aria-label="Open sidebar"
                    >
                        <Menu className="size-6" />
                    </button>

                    <button
                        className="hidden rounded-full p-2 text-on-surface-variant transition hover:bg-on-surface/8 lg:block"
                        onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                        aria-label="Toggle sidebar"
                    >
                        <PanelLeft className="size-6" />
                    </button>

                    <div className="flex-1" />
                    <div className="flex items-center gap-3">
                        <span className="hidden text-body-medium text-on-surface-variant sm:inline">
                            {page.props.auth.user?.name}
                        </span>
                        <span className="flex size-10 items-center justify-center rounded-full bg-primary text-label-large text-on-primary">
                            {page.props.auth.user?.name?.charAt(0)?.toUpperCase() ?? '?'}
                        </span>
                    </div>
                </header>

                <main className="bg-surface p-4 sm:p-6 lg:p-8">
                    {breadcrumbs && breadcrumbs.length > 0 && (
                        <nav className="mb-6" aria-label="Breadcrumb">
                            <ol className="flex items-center gap-2 text-body-small text-on-surface-variant">
                                {breadcrumbs.map((crumb, index) => (
                                    <li key={crumb.title} className="flex items-center gap-2">
                                        {index > 0 && (
                                            <span
                                                className="text-outline"
                                                aria-hidden="true"
                                            >
                                                /
                                            </span>
                                        )}
                                        {index === breadcrumbs.length - 1 ? (
                                            <span className="font-medium text-on-surface">
                                                {crumb.title}
                                            </span>
                                        ) : (
                                            <Link
                                                href={crumb.href}
                                                className="rounded-xs hover:text-primary"
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
                    className="fixed inset-0 z-40 bg-scrim/40 lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
