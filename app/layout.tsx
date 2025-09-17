import "./globals.css";
import type { Metadata } from "next";
import Providers from "./providers";

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
                        <header className="border-b bg-card">
                            <div className="container flex items-center justify-between py-3">
                                <div className="text-xl font-semibold tracking-wide">
                                    <span className="text-secondary">◆</span>{" "}
                                    <span className="text-primary">Cine</span>
                                    <span className="text-secondary">Schedule</span>
                                </div>
                            </div>
                        </header>
                        <main className="container py-6">
                            {children}
                        </main>
                    </div>
                </Providers>
            </body>
        </html>
    );
}