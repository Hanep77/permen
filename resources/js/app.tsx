import { createInertiaApp } from '@inertiajs/react';
import { Toaster } from 'sonner';
import { useFlashToast } from '@/hooks/use-flash-toast';
import { initializeTheme } from '@/hooks/use-appearance';
import AppLayout from '@/layouts/app-layout';
import AuthLayout from '@/layouts/auth-layout';
import SettingsLayout from '@/layouts/settings/layout';

const appName = import.meta.env.VITE_APP_NAME || 'Permen';

function FlashToasts() {
    useFlashToast();

    return <Toaster richColors position="top-right" />;
}

void createInertiaApp({
    title: (title) => (title),
    layout: (name) => {
        switch (true) {
            case name === 'welcome':
                return null;
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return AppLayout;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <>
                {app}
                <FlashToasts />
            </>
        );
    },
    progress: {
        color: '#006A60',
    },
});

// This will set light / dark mode on load...
initializeTheme();

if ('serviceWorker' in navigator && import.meta.env.PROD) {
    window.addEventListener('load', () => {
        void navigator.serviceWorker
            .register('/sw.js', { scope: '/' })
            .catch(() => {
                // Service worker registration is best-effort.
            });
    });
}
