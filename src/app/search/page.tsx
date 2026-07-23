'use client';

import { FormEvent, useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiFetch } from '@/lib/api-fetch';
import SearchResultCard from '@/components/search/SearchResultCard';
import type { SearchResponse, SearchResult } from '@/types/search';

function useTitleSearch(query: string) {
    const route =
        `/search?query=${encodeURIComponent(query)}&page=1&region=US`;

    return useQuery({
        queryKey: ['search', query],
        queryFn: () => apiFetch<SearchResponse>(route),
        enabled: query.length > 0,
        staleTime: 30_000,
    });
}

export default function SearchPage() {
    const queryClient = useQueryClient();

    // What is currently in the input
    const [searchInput, setSearchInput] = useState('');

    // What has actually been submitted
    const [submittedQuery, setSubmittedQuery] = useState('');

    const {
        data,
        isLoading,
        isFetching,
        isError,
        error,
        refetch,
    } = useTitleSearch(submittedQuery);

    const results = useMemo(() => data?.results ?? [], [data]);

    const addMutation = useMutation({
        mutationFn: (result: SearchResult) =>
            apiFetch('/watchlist/tmdb', {
                method: 'POST',
                body: {
                    tmdbId: result.tmdbId,
                    type: result.type,
                },
            }),

        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['watchlist'] });
            queryClient.invalidateQueries({ queryKey: ['search'] });
            queryClient.invalidateQueries({ queryKey: ['calendar'] });
        },
    });

    function handleSubmit(event: FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const cleanedQuery = searchInput.trim();

        if (!cleanedQuery) {
            return;
        }

        setSubmittedQuery(cleanedQuery);
    }

    return (
        <main className="mx-auto min-h-screen max-w-7xl px-4 py-8 sm:px-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-zinc-100">
                    Search
                </h1>

                <p className="mt-2 text-zinc-400">
                    Find movies and TV shows to add to your watchlist.
                </p>
            </div>

            <form
                onSubmit={handleSubmit}
                className="mb-8 flex max-w-2xl gap-3"
            >
                <input
                    value={searchInput}
                    onChange={(event) =>
                        setSearchInput(event.target.value)
                    }
                    placeholder="Search movies and TV shows"
                    className="min-w-0 flex-1 rounded-lg border border-white/10 bg-zinc-900 px-4 py-3 text-zinc-100 outline-none placeholder:text-zinc-500 focus:border-zinc-500"
                />

                <button
                    type="submit"
                    disabled={!searchInput.trim()}
                    className="rounded-lg bg-zinc-100 px-5 py-3 font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-40"
                >
                    Search
                </button>
            </form>

            {!submittedQuery && (
                <div className="rounded-xl border border-dashed border-white/10 px-6 py-16 text-center">
                    <h2 className="text-lg font-semibold text-zinc-200">
                        Find something to watch
                    </h2>

                    <p className="mt-2 text-zinc-500">
                        Search for a movie or TV series above.
                    </p>
                </div>
            )}

            {isLoading && (
                <p className="text-zinc-400">Searching...</p>
            )}

            {isError && (
                <div className="rounded-lg border border-red-900 bg-red-950/40 p-4 text-red-200">
                    Search failed: {error.message}
                </div>
            )}

            {!isLoading &&
                submittedQuery &&
                results.length === 0 && (
                    <p className="text-zinc-400">
                        No results found for “{submittedQuery}.”
                    </p>
                )}

            {results.length > 0 && (
                <section
                    aria-label="Search results"
                    className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
                >
                    {results.map((result) => (
                        <SearchResultCard
                            key={`${result.type}-${result.tmdbId}`}
                            result={result}
                            isAdding={
                                addMutation.isPending &&
                                addMutation.variables?.tmdbId ===
                                    result.tmdbId &&
                                addMutation.variables?.type ===
                                    result.type
                            }
                            onAdd={(selectedResult) =>
                                addMutation.mutate(selectedResult)
                            }
                        />
                    ))}
                </section>
            )}

            {addMutation.isError && (
                <p className="mb-4 text-sm text-red-300">
                    Could not add that title to your watchlist.
                </p>
            )}
        </main>
    );
}