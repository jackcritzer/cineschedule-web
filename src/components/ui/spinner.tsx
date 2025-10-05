'use client';

import * as React from 'react';
import clsx from 'clsx';

type SpinnerProps = {
    size?: number;
    className?: string;
};

export function Spinner({ size = 25, className }: SpinnerProps) {
    return (
        <div
            className={clsx(
                'inline-block animate-spin rounded-full border-2 border-muted-foreground border-t-transparent',
                className
            )}
            style={{ width: size, height: size }}
            aria-label="Loading"
            role="status"
        />
    )
}