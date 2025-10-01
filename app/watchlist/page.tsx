'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-fetch';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import RequireAuth from "@/components/require-auth";
import { getApiErrorMessage } from '@/lib/errors';
import ErrorBanner from '@/components/ui/error-banner';
import EmptyState from '@/components/empty-state';
import { Spinner } from '@/components/ui/spinner';

interface WatchlistItem {
    id: number;
    title: { id: number; name: string };
}

interface WatchlistResponse {
    items: WatchlistItem[];
    nextCursor?: string | null;
}

function useWatchlist(limit?: number) {
    const route = typeof limit === 'number'
        ? `/watchlist?limit=${limit}`
        : '/watchlist';

    return useQuery({
        queryKey: ['watchlist', { limit }],
        queryFn: () => apiFetch<WatchlistResponse>(route),
        staleTime: 30_000,
    });
}

export default function WatchlistPage() {
    const queryClient = useQueryClient();

    // Local state
    const [addId, setAddId] = useState("");

    // If you want a cap, set it here
    const limit = undefined;

    // DATA FETCH — hooks must be at the top
    const { data, isLoading, isFetching, isError, error, refetch } = useWatchlist(limit);

    // Derived data (hook)
    const items = useMemo(() => data?.items ?? [], [data]);

    // MUTATIONS — also hooks, so keep them above any early returns
    const addMutation = useMutation({
        mutationFn: async () => {
            if (!addId) throw new Error("No ID");
            return apiFetch(`/watchlist`, {
                method: "POST",
                body: { titleId: Number(addId) }, // no stringify; apiFetch handles it
            });
        },
        onSuccess: () => {
            setAddId("");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiFetch(`/watchlist/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
    });

    // EARLY RETURNS — after all hooks are declared
    if (isLoading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">
                <div className="flex flex-col items-center gap-3">
                    <Spinner size={28} />
                    <div className="text-sm text-muted-foreground">Loading watchlist…</div>
                </div>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="mx-auto w-full max-w-3xl p-4">
                <ErrorBanner message={getApiErrorMessage(error)} onRetry={() => refetch()} />
            </div>
        );
    }

    if (!items.length) {
        return (
            <div className="mx-auto w-full max-w-3xl p-4">
                <EmptyState title="Your watchlist is empty">
                    Search TMDB by ID to add your first title.
                </EmptyState>
            </div>
        );
    }

    console.log('items', items)

    return (
        <RequireAuth>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">Your Watchlist</h1>
                <div className="flex items-center gap-2">
                    <Input
                        placeholder="Enter Title ID"
                        value={addId}
                        onChange={(e) => setAddId(e.target.value)}
                    />
                    <Button
                        onClick={() => addMutation.mutate()}
                        disabled={addMutation.isPending}
                        title="Add by Title ID"
                    >
                        {addMutation.isPending ? "Adding..." : "Add"}
                    </Button>
                </div>

                <div className="text-sm text-muted-foreground">
                    Showing up to {String(limit)} item{limit === 1 ? "" : "s"}
                    {isFetching && " — refreshing..."}
                </div>

                <ul className="space-y-2">
                    {items.map((item) => (
                        <li key={item.id} className="flex items-center justify-between rounded border p-2">
                            <span>{item.title?.name || `Title #${item.title?.id ?? item.id}`}</span>
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => deleteMutation.mutate(item.id)}
                                disabled={deleteMutation.isPending}
                            >
                                Delete
                            </Button>
                        </li>
                    ))}
                </ul>
            </div>
        </RequireAuth>
    );
}