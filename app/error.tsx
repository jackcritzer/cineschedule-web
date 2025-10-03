'use client';

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <div className="mx-auto my-16 max-w-xl rounded-xl border bg-card p-6">
            <h2 className="mb-2 text-xl font-semibold">Something went wrong</h2>
            <p className="mb-4 text-sm text-muted-foreground">
                {error?.message ?? 'An unexpected error occerred.'}
            </p>
            <button
                onClick={() => reset()}
                className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
            >
                Try again
            </button>
        </div>
    );
}