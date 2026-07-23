import { SearchResult } from '@/types/search';

type SearchResultCardProps = {
    result: SearchResult;
    isAdding: boolean;
    onAdd: (result: SearchResult) => void;
};

const TMDB_IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

export default function SearchResultCard({
    result,
    isAdding,
    onAdd,
}: SearchResultCardProps) {
    const posterUrl = result.posterPath
        ? `${TMDB_IMAGE_BASE_URL}${result.posterPath}`
        : null;

    return (
        <article className="group overflow-hidden rounded-xl border border-white/10 bg-zinc-900 shadow-sm transition hover:-translate-y-1 hover:border-white/20 hover:shadow-xl">
            <div className="aspect-[2/3] overflow-hidden bg-zinc-800">
                {posterUrl ? (
                    <img
                        src={posterUrl}
                        alt={`${result.name} poster`}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center px-4 text-center text-sm text-zinc-500">
                        No poster available
                    </div>
                )}
            </div>

            <div className="flex min-h-40 flex-col p-4">
                <div className="mb-2 flex items-center gap-2 text-xs text-zinc-400">
                    <span className="rounded-full bg-zinc-800 px-2 py-1 font-medium uppercase tracking-wide">
                        {result.type}
                    </span>

                    {result.year && <span>{result.year}</span>}
                </div>

                <h2 className="line-clamp-2 text-base font-semibold text-zinc-100">
                    {result.name}
                </h2>

                { result.overview && (
                    <p className="mt-2 line-clamp-3 text-sm text-zinc-400">
                        {result.overview}
                    </p>
                ) }

                <button
                    type="button"
                    onClick={() => onAdd(result)}
                    disabled={result.isInWatchlist || isAdding}
                    className="mt-auto rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-950 transition hover:bg-white disabled:cursor-not-allowed disabled:bg-zinc-700 disabled:text-zinc-400"
                >
                    {result.isInWatchlist
                        ? 'In watchlist'
                        : isAdding
                          ? 'Adding...'
                          : 'Add to watchlist'}
                </button>
            </div>
        </article>
    );
}