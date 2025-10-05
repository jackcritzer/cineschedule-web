import PageShell from "@/components/layout/page-shell";

export default function HomePage() {
    return (
        <PageShell>
            <h1 className="font-display text-2xl font-semibold">Welcome</h1>
            <p className="text-muted-foreground">
                This thin UI will soon include /login, /watchlist, and /calendar.
            </p>
        </PageShell>
    );
}
