"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api-fetch";
import { useMemo, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import RequireAuth from "@/components/require-auth";

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

export default function CalendarPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [limit, setLimit] = useState("");

    function buildCalendarPath(params: { from?: string; to?: string; limit?: string }) {
        const qs = new URLSearchParams();
        if (params.from) qs.set('from', params.from.trim());
        if (params.to) qs.set('to', params.to.trim());
        if (params.limit) qs.set('limit', params.limit.trim()); // keep as string, or validate number first
        const s = qs.toString();
        return `/calendar${s ? `?${s}` : ''}`;
    }

    // optional: memoize a normalized filters object for a stable queryKey
    const filters = useMemo(
        () => ({
            from: from || undefined,
            to: to || undefined,
            limit: limit || undefined,
        }),
        [from, to, limit]
    );

    const { data, isLoading, error, refetch } = useQuery<CalendarResponse>({
        queryKey: ['calendar', filters],                 // stable key that excludes empties
        queryFn: () => apiFetch(buildCalendarPath(filters)),
        enabled: false,                                  // only fetch on button press
    });

    const uniqueItems = useUniqueCalendar(data?.items);

    return (
        <RequireAuth>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Calendar</h1>
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
                    <Button onClick={() => refetch()}>Fetch</Button>
                </div>
                {isLoading && <p>Loading calendar...</p>}
                {error && <p className="text-destructive">Error loading calendar</p>}
                <ul className="space-y-2">
                    {uniqueItems?.map((item) => (
                        <li key={calendarKey(item)} className="border rounded p-2">
                            <span className="font-medium">{item.title}</span>{" "}
                            — <span>{item.payload.name}</span> — <span>{item.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </RequireAuth>
    );
}