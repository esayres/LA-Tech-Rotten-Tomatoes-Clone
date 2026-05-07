import { create } from 'zustand';
import { persist, createJSONStorage, StateStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import services from '../scripts/services';
import { hydrateMovieData, HydratedMovie } from '../utils/movieMapper';
import { injectStore } from '../scripts/apiClient';

// Safe storage wrapper for Expo environments to prevent "Native module is null" errors
const safeStorage: StateStorage = {
  getItem: async (name) => {
    try {
      if (typeof AsyncStorage === 'undefined' || !AsyncStorage) return null;
      return await AsyncStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: async (name, value) => {
    try {
      if (typeof AsyncStorage === 'undefined' || !AsyncStorage) return;
      await AsyncStorage.setItem(name, value);
    } catch {}
  },
  removeItem: async (name) => {
    try {
      if (typeof AsyncStorage === 'undefined' || !AsyncStorage) return;
      await AsyncStorage.removeItem(name);
    } catch {}
  },
};

interface AppState {
  movies: HydratedMovie[];
  isLoading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  user: {
    uid: string;
    email: string;
    name: string;
    avatar: string;
  } | null;
  idToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  userVotes: Record<string | number, 'up' | 'down' | null>;

  // Actions
  fetchMovies: () => Promise<void>;
  ensureValidToken: () => Promise<string | null>;
  toggleVote: (movieId: string | number, type: 'up' | 'down') => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
}


export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      movies: [],
      isLoading: false,
      error: null,
      isAuthenticated: false,
      user: null,
      idToken: null,
      refreshToken: null,
      expiresAt: null,
      userVotes: {},

      ensureValidToken: async () => {
        const { idToken, refreshToken, expiresAt } = get();
        if (!idToken || !refreshToken || !expiresAt) return idToken;

        // Refresh if expiring in less than 5 mins
        if (Date.now() + 300000 > expiresAt) {
          try {
            const data = await services.auth.refreshToken(refreshToken);
            const newExpiresAt = Date.now() + (parseInt(data.expires_in) * 1000);
            set({ 
              idToken: data.id_token, 
              refreshToken: data.refresh_token, 
              expiresAt: newExpiresAt 
            });
            return data.id_token;
          } catch (err) {
            console.error('Refresh failed', err);
            get().logout();
            return null;
          }
        }
        return idToken;
      },

      fetchMovies: async () => {
        set({ isLoading: true, error: null });
        try {
          const data = await services.movies.getMovies();
          const hydratedMovies = hydrateMovieData(data?.movies || []);
          
          let votes: Record<string | number, 'up' | 'down' | null> = {};
          
          if (get().isAuthenticated) {
            try {
              const userLikes = await services.movies.getUserLikes();
              if (Array.isArray(userLikes)) {
                userLikes.forEach((like: any) => {
                  // Handle various ID field names (movieId, movie_id, id)
                  const mId = like.movieId ?? like.movie_id ?? like.id;
                  if (mId) {
                    votes[String(mId)] = like.rating === 'like' ? 'up' : 'down';
                  }
                });
              }
            } catch (likeErr) {
              // Silently handle like sync errors to ensure movies still show
            }
          }

          set({ 
            movies: hydratedMovies, 
            userVotes: votes, 
            isLoading: false 
          });
          console.log(`Store [fetchMovies] Sync Complete. History: ${Object.keys(votes).length} votes.`);
        } catch (err) {
          set({ error: 'Failed to fetch movies', isLoading: false });
        }
      },

      toggleVote: async (movieId, type) => {
        const { userVotes, movies, isAuthenticated } = get();
        if (!isAuthenticated) return;

        const currentVote = userVotes[movieId];
        if (currentVote === type) return; 

        const apiRating = type === 'up' ? 'like' : 'dislike';

        try {
          await services.movies.postUserLike(Number(movieId), apiRating);
          
          const updatedMovies = movies.map(m => {
            if (String(m.id) === String(movieId)) {
              let newLikes = m.likes;
              let newDislikes = m.dislikes;
              if (type === 'up') {
                newLikes++;
                if (currentVote === 'down') newDislikes--;
              } else {
                newDislikes++;
                if (currentVote === 'up') newLikes--;
              }
              const total = newLikes + newDislikes;
              const newScore = total > 0 ? Math.round((newLikes / total) * 100) : 0;
              return { ...m, likes: newLikes, dislikes: newDislikes, score: newScore };
            }
            return m;
          });

          set({
            movies: updatedMovies,
            userVotes: { ...userVotes, [movieId]: type }
          });
        } catch (err) {
          console.error('Failed to vote:', err);
        }
      },

      signUp: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await services.auth.signUp(email, password);
          const expiresAt = Date.now() + (parseInt(data.expiresIn) * 1000);
          set({
            isAuthenticated: true,
            idToken: data.idToken,
            refreshToken: data.refreshToken,
            expiresAt,
            user: {
              uid: data.localId,
              email: data.email,
              name: data.email.split('@')[0],
              avatar: `https://i.pravatar.cc/150?u=${data.localId}`,
            },
            isLoading: false
          });
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Signup failed', isLoading: false });
          throw err;
        }
      },

      login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
          const data = await services.auth.signIn(email, password);
          const expiresAt = Date.now() + (parseInt(data.expiresIn) * 1000);
          set({
            isAuthenticated: true,
            idToken: data.idToken,
            refreshToken: data.refreshToken,
            expiresAt,
            user: {
              uid: data.localId,
              email: data.email,
              name: data.email.split('@')[0],
              avatar: `https://i.pravatar.cc/150?u=${data.localId}`,
            },
            isLoading: false
          });
          
          // Fetch initial data
          get().fetchMovies();
        } catch (err: any) {
          set({ error: err.response?.data?.error?.message || 'Login failed', isLoading: false });
          throw err;
        }
      },

      logout: () => {
        set({ 
          isAuthenticated: false, 
          user: null, 
          idToken: null, 
          refreshToken: null,
          expiresAt: null,
          userVotes: {},
          movies: [] 
        });
      },
    }),
    {
      name: 'movierate-storage',
      storage: createJSONStorage(() => safeStorage),
      partialize: (state) => ({ 
        isAuthenticated: state.isAuthenticated, 
        user: state.user, 
        idToken: state.idToken, 
        refreshToken: state.refreshToken,
        expiresAt: state.expiresAt,
        userVotes: state.userVotes
      }),
    }
  )
);

// Register store with API client to break circular dependencies
injectStore(useAppStore);
