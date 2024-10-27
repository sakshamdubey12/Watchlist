import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  watchlist: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.email = action.payload;
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUser = users.find(u => u.email === action.payload);
      state.watchlist = currentUser?.watchlist || [];
    },
    
    logout(state) {
      state.email = null;
      state.watchlist = [];
    },
    
    setWatchlist(state, action) {
      state.watchlist = action.payload;
    },
    
    addToWatchlist(state, action) {
      const newWatchlist = action.payload;
      if (!state.watchlist) {
        state.watchlist = [];
      }
      state.watchlist.push(newWatchlist);
    },
    
    removeWatchlist(state, action) {
      state.watchlist = state.watchlist.filter(list => list.id !== action.payload);
    },
    
    updateWatchlists(state, action) {
      state.watchlist = action.payload;
    },
    
    // Add movie to specific watchlist
    addMovieToWatchlist(state, action) {
      const { listId, movie } = action.payload;
      const watchlist = state.watchlist.find(list => list.id === listId);
      if (watchlist) {
        if (!watchlist.movies) {
          watchlist.movies = [];
        }
        watchlist.movies.push(movie);
      }
    },
    
    // Remove movie from specific watchlist
    removeMovieFromWatchlist(state, action) {
      const { listId, movieId } = action.payload;
      const watchlist = state.watchlist.find(list => list.id === listId);
      if (watchlist && watchlist.movies) {
        watchlist.movies = watchlist.movies.filter(movie => movie.imdbID !== movieId);
      }
    }
  },
});

export const {
  login,
  logout,
  setWatchlist,
  addToWatchlist,
  removeWatchlist,
  updateWatchlists,
  addMovieToWatchlist,
  removeMovieFromWatchlist
} = userSlice.actions;

// Selectors
export const selectUser = (state) => state.user;
export const selectWatchlists = (state) => state.user.watchlist;
export const selectEmail = (state) => state.user.email;

export default userSlice.reducer;
