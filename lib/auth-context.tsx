"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiFetch, setAuthHandlers } from "./apiFetch";

interface AuthContextType {
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [token, setToken] = useState<string | null>(null);
    const persist = true //searchParams.get("persist") === "1";

    // Load from sessionStorage if dev toggle is on
    useEffect(() => {
        if (persist) {
            const stored = sessionStorage.getItem("auth_token");
            if (stored) setToken(stored);
            console.log(token)
        }
    }, [persist]);

    const logout = () => {
        setToken(null);
        if (persist) sessionStorage.removeItem("auth_token");
        router.push("/login");
    };

    const login = async (email: string, password: string) => {
        const data = await apiFetch<{ token: string }>("/auth/login", {
            method: "POST",
            body: JSON.stringify({ email, password })
        });
        setToken(data.token);
        if (persist) sessionStorage.setItem("auth_token", data.token);
        router.push("/calendar");
    };

    // Wire into apiFetch
    useEffect(() => {
        setAuthHandlers({
            getToken: () => token,
            onAuthExpired: logout
        });
    }, [token]);

    return (
        <AuthContext.Provider value={{ token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be used within AuthProvider");
    return ctx;
}