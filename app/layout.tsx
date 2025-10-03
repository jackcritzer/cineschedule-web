import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from 'react';
import Providers from "./providers";
import SiteHeader from "@/components/layout/site-header";

export const metadata: Metadata = {
    title: "CineSchedule",
    description: "Your upcoming releases at a glance."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className="dark">
            <body>
                <Providers>
                    <div className="min-h-dvh">
                        <Suspense fallback={<div className="h-14 border-b" />}>
                            <SiteHeader />
                        </Suspense>
                        <main className="container py-6">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}