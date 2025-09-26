"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function RequireAuth({ children }: { children: React.ReactNode }) {
    const { token, ready } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!ready) return; // wait until auth bootstraps
        if (!token) {
            router.replace("/login?persist=1");
        }
    }, [ready, token, router]);

    if (!ready) {
        return <p>Loading…</p>;        // tiny placeholder during bootstrap
    }
    
    if (!token) {
        return <p>Redirecting to login…</p>;
    }

    return <>{children}</>;
}