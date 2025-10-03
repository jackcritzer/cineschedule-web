'use client';

import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import NavLink from './nav-link';
import { useAuth } from '@/lib/auth-context';
import { useLogout } from '@/hooks/use-logout';

export default function SiteHeader() {
    const { token, user } = useAuth();
    const doLogout = useLogout();

    const pathname = usePathname();
    const search = useSearchParams();
    const current = search?.toString() ? `${pathname}?${search?.toString()}` : pathname;
    const loginHref = `/login?next=${encodeURIComponent(current)}`;

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4 gap-3">
                <div className="container flex items-center justify-between py-3">
                    <Link href="/" className="rounded-md px-2 py-1 text-base font-semibold">
                        <div className="text-xl font-semibold tracking-wide">
                            <span className="text-secondary">◆</span>{" "}
                            <span className="text-primary">Cine</span>
                            <span className="text-secondary">Schedule</span>
                        </div>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <nav className="hidden gap-1 sm:flex">
                        <NavLink href="/watchlist">Watchlist</NavLink>
                        <NavLink href="/calendar">Calendar</NavLink>
                    </nav>
                </div>

                {/* Auth controls */}
                <div className="flex items-center gap-2">
                    {token ? (
                        <>
                            <span className="hidden text-sm text-muted-foreground sm:inline-block">
                                {user?.email ?? 'Signed in'}
                            </span>
                            <button
                                onClick={doLogout}
                                className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 text-nowrap"
                            >
                                Log out
                            </button>
                        </>
                    ) : (
                        <Link
                            href={loginHref}
                            className="rounded-md bg-primary px-3 py-2 text-sm text-primary-foreground hover:opacity-90 text-nowrap"
                        >
                            Log in
                        </Link>
                    )}
                </div>
            </div>

            {/* Mobile nav */}
            <div className="border-t sm:hidden">
                <nav className="mx-auto flex w-full max-w-6xl gap-1 px-4 py-2">
                    <NavLink href="/watchlist" className="flex-1 text-center" exact={false}>
                        Watchlist
                    </NavLink>
                    <NavLink href="/calendar" className="flex-1 text-center" exact={false}>
                        Calendar
                    </NavLink>
                </nav>
            </div>
        </header>
    );
}