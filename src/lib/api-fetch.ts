import { z } from "zod";
import { withApiBase } from "@/config";
import { recordFromHeaders } from "./api-announcements";

const errorEnvelope = z.object({
    error: z.object({
        code: z.string(),
        message: z.string()
    })
});

let getToken: () => string | null = () => null;
let onAuthExpired: () => void = () => {};

// Allow AuthProvider to inject handlers
export function setAuthHandlers(
    opts: { getToken: () => string | null; onAuthExpired: () => void }
) {
    getToken = opts.getToken;
    onAuthExpired = opts.onAuthExpired;
}

export type ApiFetchInit = {
    method?: string;
    headers?: Record<string, string>;
    body?: unknown;
};

export async function apiFetch<T>(path: string, init: ApiFetchInit = {}): Promise<T> {
    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(init.headers as Record<string, string>)
    };

    const token = getToken();
    
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(withApiBase(path), {
        ...init,
        headers,
        body: init?.body ? JSON.stringify(init.body) : undefined,
        credentials: 'omit',
    });

    // Record deprecation hints (client only is plenty)
    if (typeof window !== 'undefined') {
        try { recordFromHeaders(res.headers); } catch { /* ignore */ }
    }

    // Parse JSON (may be error or success)
    const text = await res.text();
    let data: unknown;
    try {
        data = text ? JSON.parse(text) : null;
    } catch {
        throw { code: "INVALID_JSON", message: "Invalid JSON from server" };
    }

    if (!res.ok) {
        const parsed = errorEnvelope.safeParse(data);
        if (parsed.success) {
            if (
                res.status === 401 &&
                parsed.data.error.code === "AUTH_TOKEN_EXPIRED"
            ) {
                onAuthExpired();
            }
            throw parsed.data.error;
        }
        throw { code: "UNKNOWN_ERROR", message: "Unexpected error response" };
    }

    return data as T;
}
