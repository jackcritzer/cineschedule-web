'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PropsWithChildren } from 'react';
import clsx from 'clsx';

type NavLinkProps = PropsWithChildren<{
    href: string;
    exact?: boolean;
    className?: string;
}>;

export default function NavLink({ href, exact = false, className, children }: NavLinkProps) {
    const pathname = usePathname();
    const isActive = exact ? pathname === href : pathname.startsWith(href);

    return (
        <Link
            href={href}
            aria-current={isActive ? 'page' : undefined}
            className={clsx(
                'rounded-md px-3 py-2 text-sm transition-colors',
                isActive
                    ? 'bg-secondary text-secondary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
                className
            )}
        >
            {children}
        </Link>
    );
}