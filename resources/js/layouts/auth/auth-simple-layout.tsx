import { Link } from '@inertiajs/react';
import AppLogoIcon from '@/components/app-logo-icon';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({ children, title, description }: AuthLayoutProps) {
    return (
        <div className="flex min-h-svh items-center justify-center bg-surface p-6 text-on-surface md:p-10">
            <div className="w-full max-w-sm rounded-md bg-surface-container-high p-8 shadow-[0_4px_8px_3px_rgb(0_0_0/0.15),0_1px_3px_rgb(0_0_0/0.3)]">
                <div className="flex flex-col gap-8">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="flex flex-col items-center gap-2 font-medium"
                        >
                            <div className="flex size-14 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
                                <AppLogoIcon className="size-7 fill-current" />
                            </div>
                            <span className="sr-only">{title}</span>
                        </Link>

                        <div className="space-y-2 text-center">
                            <h1 className="text-headline-small text-on-surface">{title}</h1>
                            <p className="text-center text-body-medium text-on-surface-variant">
                                {description}
                            </p>
                        </div>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
}
