// import { usePage } from '@inertiajs/react';

import { User } from 'lucide-react';

// import AppLogoIcon from '@/components/app-logo-icon';

export default function AppLogo() {
    // const { name } = usePage().props;

    return (
        <>
            <div className="flex size-10 items-center justify-center rounded-md bg-primary-container text-on-primary-container">
                {/* <AppLogoIcon className="size-5 fill-current" /> */}
                <User className="size-5" />
            </div>
            <div className="ml-1 grid flex-1 text-left">
                <span className="truncate text-title-medium leading-tight text-on-surface">
                    PERMEN
                </span>
            </div>
        </>
    );
}
