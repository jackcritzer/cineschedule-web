"use client";

import React from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ToasterProvider from '@/app/toaster-provider'
import { AuthProvider } from "@/lib/auth-context";
import ThemeProvider from "@/lib/providers/theme-provider";

export default function Providers({ children }: { children: React.ReactNode }) {
    // Create client on the client side only
    const [queryClient] = React.useState(() => new QueryClient());

    return (
        <ThemeProvider>
            <QueryClientProvider client={queryClient}>
                <AuthProvider>
                    {children}
                </AuthProvider>
                <ToasterProvider />
            </QueryClientProvider>
        </ThemeProvider>
    );
}
