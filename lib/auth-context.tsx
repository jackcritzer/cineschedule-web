'use client';

import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import type { LoginResponse, User } from '@/types/auth';
import { setAuthHandlers } from '@/lib/api-fetch';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

type AuthContextValue = {
    token: string | null;
    user: User | null;
    login: (payload: LoginResponse, options?: { persist?: boolean }) => void;
    logout: () => void;
    persist: boolean;
    setPersist: (p: boolean) => void;
    ready: boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

/**
 * Storage keys
 * - TOKEN_KEY_PRIMARY / USER_KEY_PRIMARY are the canonical keys we write to.
 * - TOKEN_KEYS_BACKCOMPAT / USER_KEYS_BACKCOMPAT are read for backward compatibility (if you previously used different keys).
 */
const PERSIST_FLAG_KEY = 'auth_persist';
const TOKEN_KEY_PRIMARY = 'cs_token';
const USER_KEY_PRIMARY = 'cs_user';
const TOKEN_KEYS_BACKCOMPAT = ['auth_token', 'cs_token'];
const USER_KEYS_BACKCOMPAT = ['cs_user', 'auth_user'];

/* ----------------- Safe sessionStorage helpers ----------------- */
function safeSessionGet(key: string): string | null {
    try {
        if (typeof window === 'undefined') return null;
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSessionSet(key: string, val: string) {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.setItem(key, val);
    } catch {
        /* ignore */
    }
}

function safeSessionRemove(key: string) {
    try {
        if (typeof window === 'undefined') return;
        sessionStorage.removeItem(key);
    } catch {
        /* ignore */
    }
}

function safeSessionGetJSON<T>(key: string): T | null {
    try {
        const raw = safeSessionGet(key);
        if (!raw) return null;
        return JSON.parse(raw) as T;
    } catch {
        return null;
    }
}

/* Read the first present value across multiple keys (for back-compat). */
function getFirstSession(keys: string[]): string | null {
    for (const k of keys) {
        const v = safeSessionGet(k);
        if (v) return v;
    }
    return null;
}

function getFirstSessionJSON<T>(keys: string[]): T | null {
    for (const k of keys) {
        const v = safeSessionGetJSON<T>(k);
        if (v) return v;
    }
    return null;
}

/* ----------------- Provider ----------------- */
export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // 1) Determine initial persist synchronously (URL param ?persist=1 wins once, else restore)
    const initialPersist = (() => {
        if (typeof window === 'undefined') return false;
        const q = new URLSearchParams(window.location.search);
        if (q.get('persist') === '1') {
            safeSessionSet(PERSIST_FLAG_KEY, '1');
            return true;
        }
        return safeSessionGet(PERSIST_FLAG_KEY) === '1';
    })();

    // 2) Seed auth state synchronously for snappy hydration
    const initialToken = initialPersist ? getFirstSession([TOKEN_KEY_PRIMARY, ...TOKEN_KEYS_BACKCOMPAT]) : null;
    const initialUser = initialPersist ? getFirstSessionJSON<User>([USER_KEY_PRIMARY, ...USER_KEYS_BACKCOMPAT]) : null;

    const [persist, setPersistState] = useState<boolean>(initialPersist);
    const [token, setToken] = useState<string | null>(initialToken);
    const [user, setUser] = useState<User | null>(initialUser);
    const [ready, setReady] = useState<boolean>(false);

    // Keep latest token accessible to apiFetch via setAuthHandlers
    const tokenRef = useRef<string | null>(initialToken);

    // Persist flag toggler
    const setPersist = (p: boolean) => {
        setPersistState(p);
        if (p) {
            safeSessionSet(PERSIST_FLAG_KEY, '1');
            // If we already have auth in memory, mirror it to storage now
            if (token) safeSessionSet(TOKEN_KEY_PRIMARY, token);
            if (user) safeSessionSet(USER_KEY_PRIMARY, JSON.stringify(user));
        } else {
            safeSessionRemove(PERSIST_FLAG_KEY);
            safeSessionRemove(TOKEN_KEY_PRIMARY);
            safeSessionRemove(USER_KEY_PRIMARY);
        }
    };

    // Register (or re-register) apiFetch handlers whenever token changes
    useEffect(() => {
        tokenRef.current = token;

        setAuthHandlers({
            getToken: () => tokenRef.current,
            onAuthExpired: (() => {
                // Avoid duplicate handling if multiple requests 401 at once
                let handled = false;
                return () => {
                    if (handled) return;
                    handled = true;

                    setToken(null);
                    setUser(null);
                    safeSessionRemove(TOKEN_KEY_PRIMARY);
                    safeSessionRemove(USER_KEY_PRIMARY);

                    toast.error('Session expired. Please sign in again.');
                    if (typeof window !== 'undefined') {
                        const next = window.location.pathname + window.location.search;
                        router.replace(`/login?next=${encodeURIComponent(next)}`);
                    } else {
                        router.replace('/login');
                    }
                };
            })(),
        });

        // Mark provider ready after handlers are set the first time
        setReady(true);
    }, [token, router]);

    const value = useMemo<AuthContextValue>(() => {
        return {
            token,
            user,
            persist,
            setPersist,
            ready,

            login: (payload, options) => {
                const persistNow = options?.persist ?? persist;
                setToken(payload.token);
                setUser(payload.user ?? null);

                if (persistNow) {
                    safeSessionSet(TOKEN_KEY_PRIMARY, payload.token);
                    safeSessionSet(USER_KEY_PRIMARY, JSON.stringify(payload.user ?? null));
                    safeSessionSet(PERSIST_FLAG_KEY, '1');
                    if (!persist) setPersistState(true); // reflect that we’re now persisting
                }
            },

            logout: () => {
                setToken(null);
                setUser(null);
                safeSessionRemove(TOKEN_KEY_PRIMARY);
                safeSessionRemove(USER_KEY_PRIMARY);
                // note: do not clear PERSIST_FLAG_KEY here; let the user’s preference stick
            },
        };
    }, [token, user, persist, ready]);

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/* ----------------- Hook ----------------- */
export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
    return ctx;
}