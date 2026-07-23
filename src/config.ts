// Centralized API base & helpers

const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_ORIGIN ?? 'http://localhost:3000';

export function withApiBase(path: string): string {
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    return `${API_ORIGIN.replace(/\/$/, '')}${normalizedPath}`;
}

// Optional dev aid
if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[API]', { origin: API_ORIGIN });
}