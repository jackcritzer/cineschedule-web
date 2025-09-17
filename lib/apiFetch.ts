import { z } from "zod";

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

export async function apiFetch<T>(
    path: string,
    options: RequestInit = {}
): Promise<T> {
    const base = process.env.NEXT_PUBLIC_API_BASE;
    if (!base) throw new Error("NEXT_PUBLIC_API_BASE not set");

    const headers: Record<string, string> = {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>)
    };

    const token = getToken();
    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const res = await fetch(`${base}${path}`, {
        ...options,
        headers
    });

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
