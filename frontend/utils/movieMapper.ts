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
  genre: string;
  year: string;
  movieId?: number;
}

export interface HydratedMovie extends RawMovie {
  score: number;
  upvotes: number;
  downvotes: number;
  desc: string;
  duration: string;
  color: string;
  emoji: string;
}

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
    const mockData = generateConsistentMock(movie.id);
    return {
      ...movie,
      score: movie.score ?? mockData.score,
      upvotes: movie.upvotes ?? mockData.upvotes,
      downvotes: movie.downvotes ?? mockData.downvotes,
      desc: movie.desc ?? mockData.desc,
      duration: movie.duration ?? mockData.duration,
      color: movie.color ?? mockData.color,
      emoji: movie.emoji ?? mockData.emoji,
    };
  });
};
