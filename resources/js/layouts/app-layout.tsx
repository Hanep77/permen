import AppSidebarDashboardLayout from '@/layouts/app/app-sidebar-dashboard-layout';
import type { BreadcrumbItem } from '@/types';

export default function AppLayout({
    breadcrumbs = [],
    children,
}: {
    breadcrumbs?: BreadcrumbItem[];
    children: React.ReactNode;
}) {
    return (
        <AppSidebarDashboardLayout breadcrumbs={breadcrumbs}>
            {children}
        </AppSidebarDashboardLayout>
    );
}
