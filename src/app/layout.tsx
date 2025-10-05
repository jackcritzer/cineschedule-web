import "./globals.css";
import type { Metadata } from "next";
import { Suspense } from 'react';
import Providers from "./providers";
import SiteHeader from "@/components/layout/site-header";
import { fontDisplay, fontSans, fontSerif } from './fonts';
import ApiDeprecationBanner from '@/components/system/api-deprecation-banner';

export const metadata: Metadata = {
    title: { default: 'CineSchedule', template: '%s · CineSchedule' },
    description: 'Track upcoming movie & TV releases.'
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="en" className={`${fontDisplay.variable} ${fontSans.variable} ${fontSerif.variable}`}>
            <body className="min-h-screen bg-background text-foreground antialiased">
                <Providers>
                    <div className="min-h-dvh flex flex-col">
                        <Suspense fallback={<div className="h-14 border-b" />}>
                            <SiteHeader />
                        </Suspense>
                        <ApiDeprecationBanner />
                        <main className="bg-film noise noise-course scanlines py-6 h-max flex-1 w-full">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}