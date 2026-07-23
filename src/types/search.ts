export type SearchResult = {
    tmdbId: number;
    type: 'MOVIE' | 'TV';
    name: string;
    releaseDate: string | null;
    year: number | null;
    posterPath: string | null;
    overview: string | null;
    isInWatchlist: boolean;
};

export type SearchResponse = {
    results: SearchResult[];
	page: number;
	totalPages: number;
	totalResults: number;
}