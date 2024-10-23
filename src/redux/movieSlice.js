// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   searchResults: [],
//   watchlist: []
// };

// const movieSlice = createSlice({
//   name: 'movies',
//   initialState,
//   reducers: {
//     setSearchResults: (state, action) => {
//       state.searchResults = action.payload;
//     },
//     addToWatchlist: (state, action) => {
//       state.watchlist.push(action.payload);
//     },
//     removeFromWatchlist: (state, action) => {
//       state.watchlist = state.watchlist.filter(
//         movie => movie.imdbID !== action.payload
//       );
//     }
//   }
// });

// export const { setSearchResults, addToWatchlist, removeFromWatchlist } = movieSlice.actions;
// export default movieSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  searchResults: [], // Results from movie searches
  watchlists: {
    // Default watchlists, which can be added dynamically
    Favorites: [],
    "Watch Later": []
  }
};

const movieSlice = createSlice({
  name: 'movies',
  initialState,
  reducers: {
    setSearchResults: (state, action) => {
      state.searchResults = action.payload;
    },
    
    addNewWatchlist: (state, action) => {
      const { watchlistName } = action.payload;
      if (!state.watchlists[watchlistName]) {
        state.watchlists[watchlistName] = [];
      }
    },

    addToWatchlist: (state, action) => {
      const { watchlistName, movie } = action.payload;
      if (state.watchlists[watchlistName]) {
        state.watchlists[watchlistName].push(movie);
      }
    },

    removeFromWatchlist: (state, action) => {
      const { watchlistName, imdbID } = action.payload;
      if (state.watchlists[watchlistName]) {
        state.watchlists[watchlistName] = state.watchlists[watchlistName].filter(
          movie => movie.imdbID !== imdbID
        );
      }
    },

    deleteWatchlist: (state, action) => {
      const { watchlistName } = action.payload;
      delete state.watchlists[watchlistName]; // Remove entire watchlist
    }
  }
});

export const {
  setSearchResults,
  addNewWatchlist,
  addToWatchlist,
  removeFromWatchlist,
  deleteWatchlist
} = movieSlice.actions;

export default movieSlice.reducer;
