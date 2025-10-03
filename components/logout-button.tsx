'use client';

import { useLogout } from '@/hooks/use-logout';

export default function LogoutButton({ className }: { className?: string }) {
    const doLogout = useLogout();
    return (
        <button
            onClick={doLogout}
            className={className ?? 'rounded-md bg-secondary px-3 py-2 text-secondary-foreground hover:opacity-90'}
        >
            Log out
        </button>
    );
}