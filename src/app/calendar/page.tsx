"use client";

import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-fetch";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RequireAuth from "@/components/require-auth";
import PageShell from '@/components/layout/page-shell';
import ErrorBanner from '@/components/ui/error-banner';
import EmptyState from '@/components/system/empty-state';
import { getApiErrorMessage } from '@/lib/errors';
import { Spinner } from "@/components/ui/spinner";

interface CalendarItem {
    titleId: number;
    date: string;
    title: string;
    payload: { 
        id: number; 
        name: string,
        payload: {
            name: string;
            episodeId: number;
            season: number;
            episode: number;
        }
    };
    type: 'theatrical' | 'digital' | 'streaming';
    providerId?: string | number | null; // e.g., Netflix id / retailer id
    region?: string | null;              // e.g., 'US'
}


const dayKey = (iso: string) => iso.slice(0, 10);

const calendarKey = (i: CalendarItem) =>
    [
        i.titleId,
        dayKey(i.date),
        i.type,
        i.providerId ?? '',
        i.region ?? '',
    ].join('|');

interface CalendarResponse {
    items: CalendarItem[];
    nextCursor?: string | null;
}

const useUniqueCalendar = (items: CalendarItem[] | undefined) =>
    useMemo(() => {
        if (!items) return [];
        const seen = new Set<string>();
        const out: CalendarItem[] = [];
        for (const it of items) {
            const k = calendarKey(it);
            if (seen.has(k)) continue;
            seen.add(k);
            out.push(it);
        }
        return out;
    }, [items]);

function buildCalendarPath(params: { from?: string; to?: string; limit?: string }) {
    const qs = new URLSearchParams();
    if (params.from) qs.set('from', params.from.trim());
    if (params.to) qs.set('to', params.to.trim());
    if (params.limit) qs.set('limit', params.limit.trim()); // keep as string, or validate number first
    const s = qs.toString();
    return `/calendar${s ? `?${s}` : ''}`;
}

export default function CalendarPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [limit, setLimit] = useState("");

    // Applied filters used by the query (start as “no filters” → fetch on mount)
    const [filters, setFilters] = useState<{from?: string; to?: string; limit?: string}>({});

    const { data, isLoading, isFetching, isError, error, refetch } = useQuery<CalendarResponse>({
        queryKey: ['calendar', filters],                 // stable key that excludes empties
        queryFn: () => apiFetch<CalendarResponse>(buildCalendarPath(filters)),
        staleTime: 60_000,
        placeholderData: keepPreviousData
    });


    function applyFilters() {
        setFilters({
        from: from || undefined,
        to: to || undefined,
        limit: limit || undefined,
        });
    }

    function clearFilters() {
        setFrom('');
        setTo('');
        setLimit('');
        setFilters({}); // triggers fetch with default backend params
    }


    if (isLoading) {
        return (
        <div className="flex min-h-[60vh] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
            <Spinner size={28} />
            <div className="text-sm text-muted-foreground">Loading releases…</div>
            </div>
        </div>
        );
    }

    if (isError) {
        return (
        <div className="mx-auto w-full max-w-4xl p-4">
            <ErrorBanner message={getApiErrorMessage(error)} onRetry={() => refetch()} />
        </div>
        );
    }

    const uniqueItems = useUniqueCalendar(data?.items);

    return (
        <RequireAuth>
            <PageShell>
                <h1 className="font-display text-2xl">Calendar</h1>
                <div className="flex gap-2">
                    <Input
                        type="date"
                        value={from}
                        onChange={(e) => setFrom(e.target.value)}
                    />
                    <Input
                        type="date"
                        value={to}
                        onChange={(e) => setTo(e.target.value)}
                    />
                    <Input
                        type="number"
                        placeholder="Limit"
                        value={limit}
                        onChange={(e) => setLimit(e.target.value)}
                    />
                    <div className="ml-auto flex gap-2">
                        <Button onClick={applyFilters} title="Apply filters to results">
                            Filter
                        </Button>
                        <Button onClick={clearFilters} variant="secondary" title="Clear all filters">
                            Clear Filters
                        </Button>
                        <Button onClick={() => refetch()} variant="outline" title="Refresh results">
                            Refresh
                        </Button>
                    </div>
                </div>
                <div className="mb-3 text-sm text-muted-foreground">
                    {isFetching ? 'Updating…' : ' '}
                </div>
                {uniqueItems.length === 0 ? (
                    <EmptyState title="No releases found">Try expanding your date range.</EmptyState>
                ) : (
                    <ul className="space-y-2">
                        {uniqueItems?.map((item) => (
                            <li key={calendarKey(item)} className="border rounded p-2">
                                <span className="font-medium">{item.title}</span>{" "}
                                — <span>{item.payload.name}</span> — <span>{item.date}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </PageShell>
        </RequireAuth>
    );
}