import { create } from 'zustand';
import services from '../scripts/services';
import { hydrateMovieData, HydratedMovie } from '../utils/movieMapper';

interface AppState {
  movies: HydratedMovie[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: {
    name: string;
    email: string;
    avatar: string;
  } | null;
  userVotes: Record<string | number, 'up' | 'down' | null>;

  // Actions
  fetchMovies: () => Promise<void>;
  toggleVote: (movieId: string | number, type: 'up' | 'down') => void;
  login: (email: string) => void;
  logout: () => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  movies: [],
  isLoading: false,
  error: null,
  isAuthenticated: false,
  user: null,
  userVotes: {},

  fetchMovies: async () => {
    set({ isLoading: true, error: null });
    try {
      const rawMovies = await services.getMovies();
      const hydratedMovies = hydrateMovieData(rawMovies);
      set({ movies: hydratedMovies, isLoading: false });
    } catch (err) {
      set({ error: 'Failed to fetch movies', isLoading: false });
    }
  },

  toggleVote: (movieId, type) => {
    const { userVotes, isAuthenticated } = get();
    if (!isAuthenticated) return;
    const currentVote = userVotes[movieId];
    
    let newVote: 'up' | 'down' | null = type;
    if (currentVote === type) {
      newVote = null; // Unvote
    }

    set({
      userVotes: {
        ...userVotes,
        [movieId]: newVote,
      }
    });

    // In a real app, we would sync this with the backend
  },

  login: (email) => {
    set({
      isAuthenticated: true,
      user: {
        name: email.split('@')[0],
        email: email,
        avatar: 'https://i.pravatar.cc/150?u=' + email,
      }
    });
  },

  logout: () => {
    set({ isAuthenticated: false, user: null });
  },
}));
