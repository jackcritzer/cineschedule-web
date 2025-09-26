"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, setAuthHandlers } from "./apiFetch";

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    persist: boolean;
    setPersist: (p: boolean) => void;
    ready: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const PERSIST_FLAG_KEY = "auth_persist";
const TOKEN_KEY = "auth_token";

// Safely read sessionStorage (no throw in SSR/deny scenarios)
function safeSessionGet(key: string): string | null {
    try {
        if (typeof window === "undefined") return null;
        return sessionStorage.getItem(key);
    } catch {
        return null;
    }
}

function safeSessionSet(key: string, val: string) {
    try {
        if (typeof window === "undefined") return;
        sessionStorage.setItem(key, val);
    } catch { /* ignore */ }
}

function safeSessionRemove(key: string) {
    try {
        if (typeof window === "undefined") return;
        sessionStorage.removeItem(key);
    } catch { /* ignore */ }
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();

    // Determine initial persist synchronously:
    // 1) If URL has ?persist=1 on first load, enable and store flag.
    // 2) Else, restore from sessionStorage.
    const initialPersist = (() => {
        if (typeof window === "undefined") return false;
        const q = new URLSearchParams(window.location.search);
        if (q.get("persist") === "1") {
            safeSessionSet(PERSIST_FLAG_KEY, "1");
            return true;
        }
        return safeSessionGet(PERSIST_FLAG_KEY) === "1";
    })();

    // Persist flag is sticky in sessionStorage. Query param (?persist=1) can enable it once.
    const [persist, setPersistState] = useState<boolean>(initialPersist);

    // Initialize token synchronously if persist is on
    const initialToken = (() => {
        if (!initialPersist) return null;
        return safeSessionGet(TOKEN_KEY);
    })();

    const [token, setToken] = useState<string | null>(initialToken);
    const [ready, setReady] = useState<boolean>(true);
    
    const setPersist = (p: boolean) => {
        setPersistState(p);
        if (p) {
            safeSessionSet(PERSIST_FLAG_KEY, "1");
        } else {
            safeSessionRemove(PERSIST_FLAG_KEY);
            safeSessionRemove(TOKEN_KEY);
        }
    };

    const logout = () => {
        setToken(null);
        safeSessionRemove(TOKEN_KEY);
        router.push("/login");
    };

    const login = async (email: string, password: string) => {
        const data = await apiFetch<{ token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
        setToken(data.token);
        if (persist) {
            safeSessionSet(TOKEN_KEY, data.token);
        }
        router.push("/watchlist");
    };

    // Wire into apiFetch
    useEffect(() => {
        setAuthHandlers({
            getToken: () => token,
            onAuthExpired: logout
        });
    }, [token]);

    const value = useMemo<AuthContextType>(
        () => ({ token, login, logout, persist, setPersist, ready }),
        [token, persist, ready]
    );

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}