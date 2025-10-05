// Global store to surface API deprecation notices from response headers.

export type DeprecationInfo = {
    deprecated: boolean;
    sunset?: string | null;        // RFC 1123 date string (GMT)
    successor?: string | null;     // e.g., "/v2"
    version?: string | null;       // e.g., "v1"
    firstSeenAt: number;           // epoch ms — to avoid toggling
};

let current: DeprecationInfo | null = null;
const subs = new Set<() => void>();

export function subscribe(fn: () => void) {
    subs.add(fn);
    return () => subs.delete(fn);
}
export function getSnapshot() {
    return current;
}

function notify(next: DeprecationInfo | null) {
    current = next;
    subs.forEach((fn) => fn());
}

// Parse Link: </v2>; rel="successor-version"
function parseSuccessor(linkHeader: string | null): string | null {
  if (!linkHeader) return null;
  for (const part of linkHeader.split(',')) {
    const m = /<([^>]+)>\s*;\s*rel="?successor-version"?/i.exec(part);
    const url = m?.[1] ?? null;   // coalesce undefined -> null
    if (url) return url;
  }
  return null;
}

// Call this after each fetch (client-side is enough)
export function recordFromHeaders(h: Headers) {
    const dep = h.get('Deprecation');
    const deprecated = dep?.toLowerCase() === 'true';
    if (!deprecated) return;

    const sunset = h.get('Sunset');
    const link = h.get('Link');
    const version = h.get('X-API-Version');

    // Only set once (first seen wins). If you prefer “latest”, remove guard.
    if (current?.deprecated) return;

    notify({
        deprecated: true,
        sunset: sunset || null,
        successor: parseSuccessor(link),
        version: version || null,
        firstSeenAt: Date.now(),
    });
}
