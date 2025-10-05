'use client';

import { ReactNode } from 'react';

export default function PageShell({
    children,
    className,
}: {
    children: ReactNode;
    className?: string;
}) {
    return (
        <div className={`container w-[1024px] mx-auto max-w-6xl space-y-6 px-4 py-6 ${className ?? ''}`}>
            {children}
        </div>
    );
}