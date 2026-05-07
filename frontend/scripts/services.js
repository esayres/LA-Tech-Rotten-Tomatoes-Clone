import axios from 'axios';
import apiClient from './apiClient';

const FIREBASE_API_KEY = process.env.EXPO_PUBLIC_FIREBASE_API;

/**
 * Authentication Services (Direct Firebase Auth)
 */
const auth = {
  signUp: async (email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=${FIREBASE_API_KEY}`;
    const response = await axios.post(url, { email, password, returnSecureToken: true });
    return response.data;
  },

  signIn: async (email, password) => {
    const url = `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${FIREBASE_API_KEY}`;
    const response = await axios.post(url, { email, password, returnSecureToken: true });
    return response.data;
  },

  refreshToken: async (refreshToken) => {
    const url = `https://securetoken.googleapis.com/v1/token?key=${FIREBASE_API_KEY}`;
    const params = new URLSearchParams();
    params.append('grant_type', 'refresh_token');
    params.append('refresh_token', refreshToken);

    const response = await axios.post(url, params.toString(), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });
    return response.data;
  },
};

/**
 * Movie & Interaction Services (Backend API)
 */
const movies = {
  getMovies: async (startAfter = null, limit = 20) => {
    const params = { limit };
    if (startAfter) params.startAfter = startAfter;
    
    const response = await apiClient.get('/getMovies', { params });
    return response.data.ok ? response.data.data : { movies: [], nextCursor: null };
  },

  getMovieScore: async (movieId) => {
    const response = await apiClient.post('/getMovieScore', { movieId });
    return response.data.ok ? response.data.data : null;
  },

  getReviews: async (movieId) => {
    const response = await apiClient.post('/getReviews', { movieId });
    const data = response.data.ok ? response.data.data : [];
    return Array.isArray(data) ? data : [];
  },

  getUserReviews: async () => {
    const response = await apiClient.get('/getUserReviews');
    return response.data.ok ? response.data.data : [];
  },

  getUserLikes: async () => {
    try {
      const response = await apiClient.get('/getUserLikes');
      // Handle both {ok, data: [...]} and raw array if backend changes
      let data = response.data.ok ? response.data.data : (Array.isArray(response.data) ? response.data : []);
      
      // If backend returns a single object instead of an array, wrap it
      if (data && typeof data === 'object' && !Array.isArray(data)) {
        console.warn('API Resilience: Converting single object to array', data);
        data = [data];
      }

      return Array.isArray(data) ? data : [];
    } catch (err) {
      console.error('Failed to fetch user likes:', err);
      return [];
    }
  },

  postUserLike: async (movieId, rating) => {
    try {
      const response = await apiClient.post('/postUserLike', { movieId, rating });
      return response.data.ok ? response.data.data : null;
    } catch (err) {
      // Error is already logged by apiClient interceptor
      throw err;
    }
  },

  postUserReview: async (movieId, review) => {
    const response = await apiClient.post('/postUserReview', { movieId, review });
    return response.data.ok ? response.data.data : null;
  },
};

export default { auth, movies };