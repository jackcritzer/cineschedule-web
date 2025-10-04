'use client';

import { AlertTriangle, RotateCw } from 'lucide-react';

type Props = {
    message: string;
    onRetry?: () => void;
};

export default function ErrorBanner({ message, onRetry }: Props) {
    return (
        <div className="mb-4 flex items-start gap-3 rounded-md border border-destructive/40 bg-destructive/10 p-3 text-destructive">
            <AlertTriangle className="mt-0.5 h-4 w-4 flex-none" />
            <div className="flex-1 text-sm">{message || 'Something went wrong.'}</div>
            {onRetry ? (
                <button
                    onClick={onRetry}
                    className="inline-flex items-center gap-1 rounded bg-destructive px-2 py-1 text-xs text-destructive-foreground hover:opacity-90"
                >
                    <RotateCw className="h-3.5 w-3.5" />
                    Retry
                </button>
            ) : null}
        </div>
    );
}