"use client";

import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
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
}

interface CalendarResponse {
    items: CalendarItem[];
    nextCursor?: string | null;
}

export default function CalendarPage() {
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [limit, setLimit] = useState("");

    const { data, isLoading, error, refetch } = useQuery<CalendarResponse>({
        queryKey: ["calendar", { from, to, limit }],
        queryFn: () =>
            apiFetch(
                `/calendar?from=${from || ""}&to=${to || ""}&limit=${limit || ""}`
            ),
        enabled: false // only fetch on button press
    });

    const items = useMemo(() => data?.items ?? [], [data]);

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
                    {items?.map((item) => (
                        <li key={item.titleId} className="border rounded p-2">
                            <span className="font-medium">{item.title}</span>{" "}
                            — <span>{item.payload.name}</span> — <span>{item.date}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </RequireAuth>
    );
}