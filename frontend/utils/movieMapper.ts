/**
 * MovieRate Data Hydration Layer
 * 
 * This utility catch raw API data and injects consistent mock placeholders 
 * for missing UI fields (score, upvotes, downvotes, etc.) to maintain the 
 * high-fidelity design aesthetics.
 */

interface RawMovie {
  id: string | number;
  title: string;
  movieId?: number;
  // New fields from DB
  adult?: boolean;
  backdropPath?: string;
  dislikes?: number;
  genres?: string[];
  imdbId?: string;
  likes?: number;
  overview?: string;
  popularity?: number;
  posterPath?: string;
  releaseDate?: string;
  revenue?: number;
  runtime?: number;
  status?: string;
  tagline?: string;
  voteCount?: number;
  // Legacy fields (optional)
  genre?: string;
  year?: string;
}

export interface HydratedMovie extends RawMovie {
  score: number;
  upvotes: number;
  downvotes: number;
  desc: string;
  duration: string;
  color: string;
  emoji: string;
  posterUrl: string | null;
  backdropUrl: string | null;
  displayGenre: string;
  displayYear: string;
}

const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/';

const formatRuntime = (minutes?: number): string => {
  if (!minutes) return 'N/A';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
};

const generateConsistentMock = (id: string | number) => {
  const idStr = String(id);
  // Simple deterministic hash based on ID
  let hash = 0;
  for (let i = 0; i < idStr.length; i++) {
    hash = idStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  hash = Math.abs(hash);

  const scores = [88, 92, 75, 81, 95, 68, 84, 90];
  const colors = ['#4c6ef5', '#20c997', '#fab005', '#fa5252', '#be4bdb', '#15aabf'];
  const emojis = ['🎬', '🔥', '🍿', '⭐', '🎭', '🎥'];
  const durations = ["2h 15m", "1h 58m", "2h 32m", "2h 05m", "1h 45m"];

  return {
    score: scores[hash % scores.length],
    upvotes: (hash % 1000) + 500,
    downvotes: (hash % 200),
    duration: durations[hash % durations.length],
    color: colors[hash % colors.length],
    emoji: emojis[hash % emojis.length],
    desc: "A gripping cinematic experience that pushes the boundaries of storytelling. (Full description pending backend update)."
  };
};

export const hydrateMovieData = (apiMovies: any[]): HydratedMovie[] => {
  if (!apiMovies) return [];
  
  return apiMovies.map(movie => {
    // Ensure we have a valid ID (new DB uses movieId)
    const finalId = movie.movieId ?? movie.id;
    const mockData = generateConsistentMock(finalId);
    
    // Calculate score from likes/dislikes if available
    let calculatedScore = mockData.score;
    if (movie.likes !== undefined && movie.dislikes !== undefined) {
      const total = movie.likes + movie.dislikes;
      if (total > 0) {
        calculatedScore = Math.round((movie.likes / total) * 100);
      }
    }

    return {
      ...movie,
      id: finalId,
      score: calculatedScore,
      upvotes: movie.likes ?? movie.upvotes ?? mockData.upvotes,
      downvotes: movie.dislikes ?? movie.downvotes ?? mockData.downvotes,
      desc: movie.overview ?? movie.desc ?? mockData.desc,
      duration: movie.runtime ? formatRuntime(movie.runtime) : (movie.duration ?? mockData.duration),
      color: movie.color ?? mockData.color,
      emoji: movie.emoji ?? mockData.emoji,
      posterUrl: movie.posterPath ? `${TMDB_IMAGE_BASE}w500${movie.posterPath}` : null,
      backdropUrl: movie.backdropPath ? `${TMDB_IMAGE_BASE}original${movie.backdropPath}` : null,
      displayGenre: movie.genres && movie.genres.length > 0 ? movie.genres[0] : (movie.genre ?? 'Drama'),
      displayYear: movie.releaseDate ? movie.releaseDate.split('-')[0] : (movie.year ?? '2023'),
    };
  });
};
