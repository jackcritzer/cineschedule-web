// Centralized API base & helpers

export const API_ORIGIN =
    process.env.NEXT_PUBLIC_API_ORIGIN ?? 'https://api.cineschedule.com';

export const API_VERSION =
    process.env.NEXT_PUBLIC_API_VERSION ?? 'v1';

// e.g. https://api.cineschedule.com/v2
export const API_BASE = `${API_ORIGIN.replace(/\/+$/, '')}/${API_VERSION}`;

export function withApiBase(path: string) {
    const p = path.startsWith('/') ? path : `/${path}`;
    return `${API_BASE}${p}`;
}

// Optional dev aid
if (process.env.NODE_ENV !== 'production') {
    // eslint-disable-next-line no-console
    console.log('[API]', { origin: API_ORIGIN, version: API_VERSION, base: API_BASE });
}