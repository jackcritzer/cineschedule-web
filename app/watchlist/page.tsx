"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiFetch } from "@/lib/apiFetch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useMemo, useState } from "react";
import RequireAuth from "@/components/require-auth";

interface WatchlistItem {
    id: number;
    title: { id: number; name: string };
}

interface WatchlistResponse {
    items: WatchlistItem[];
    nextCursor?: string | null;
}

export default function WatchlistPage() {
    const queryClient = useQueryClient();
    const [addId, setAddId] = useState("");
    const limit = 5;

    const { data, isLoading, isFetching, error } = useQuery<WatchlistResponse>({
        queryKey: ["watchlist", { limit }],
        queryFn: () => apiFetch<WatchlistResponse>(`/watchlist?limit=${limit}`)
    });

    const items = useMemo(() => data?.items ?? [], [data]);

    const addMutation = useMutation({
        mutationFn: async () => {
            if (!addId) throw new Error("No ID");
            return apiFetch(`/watchlist`, {
                method: "POST",
                body: JSON.stringify({ titleId: Number(addId) })
            });
        },
        onSuccess: () => {
            setAddId("");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        }
    });

    const deleteMutation = useMutation({
        mutationFn: (id: number) => apiFetch(`/watchlist/${id}`, { method: "DELETE" }),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        }
    });

    return (
        <RequireAuth>
            <div className="space-y-6">
                <h1 className="text-2xl font-semibold">My Watchlist</h1>

                <div className="flex gap-2 items-center">
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

                {error && (
                    <p className="text-destructive text-sm">
                        {(error as any)?.message || "Error loading watchlist"}
                    </p>
                )}

                <div className="text-sm text-muted-foreground">
                    Showing up to {limit} item{limit === 1 ? "" : "s"}
                    {isFetching && " — refreshing..."}
                </div>

                {isLoading ? (
                    <p>Loading watchlist...</p>
                ) : (
                    <ul className="space-y-2">
                        {items.map((item) => (
                            <li key={item.id} className="flex items-center justify-between border p-2 rounded">
                                <span>{item.title?.name || `Title #${item.title.id}`}</span>
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
                )}

                {items.length === 0 && !isLoading && (
                    <p className="text-muted-foreground">No items yet.</p>
                )}
            </div>
        </RequireAuth>
    );
}