'use client';

export default function GlobalError({
    error,
    reset,
}: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    return (
        <html>
            <body className="min-h-screen bg-background text-foreground">
                <div className="mx-auto my-16 max-w-xl rounded-xl border bg-card p-6">
                    <h2 className="mb-2 text-xl font-semibold">App crashed</h2>
                    <p className="mb-4 text-sm text-muted-foreground">
                        {error?.message ?? 'An unexpected error occurred.'}
                    </p>
                    <button
                        onClick={() => reset()}
                        className="rounded-md bg-primary px-4 py-2 text-primary-foreground"
                    >
                        Reload
                    </button>
                </div>
            </body>
        </html>
    );
}