// import { createSlice } from '@reduxjs/toolkit';

// const initialState = {
//   email: null,
//   watchlist: JSON.parse(localStorage.getItem('watchlist')) || [],
// };

// const userSlice = createSlice({
//   name: 'user',
//   initialState,
//   reducers: {
//     login(state, action) {
//       state.email = action.payload;
//     },
//     logout(state) {
//       state.email = null;
//       state.watchlist = [];
//     },
//     addToWatchlist(state, action) {
//       state.watchlist.push(action.payload);
//       localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
//     },
//     removeFromWatchlist(state, action) {
//       state.watchlist = state.watchlist.filter(movie => movie.imdbID !== action.payload);
//       localStorage.setItem('watchlist', JSON.stringify(state.watchlist));
//     },
//   },
// });

// export const { login, logout, addToWatchlist, removeFromWatchlist } = userSlice.actions;
// export default userSlice.reducer;


import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  email: null,
  watchlists: JSON.parse(localStorage.getItem('watchlists')) || {}, // Load from localStorage if available
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    login(state, action) {
      state.email = action.payload;
    },
    logout(state) {
      state.email = null;
      state.watchlists = {};
      localStorage.removeItem('watchlists'); // Clear watchlists from localStorage on logout
    },
    // addNewWatchlist(state, action) {
    //   const { watchlistName } = action.payload;
    //   if (!state.watchlists[watchlistName]) {
    //     state.watchlists[watchlistName] = []; // Create a new watchlist if it doesn't exist
    //     localStorage.setItem('watchlists', JSON.stringify(state.watchlists)); // Save to localStorage
    //   }
    // },
    addToWatchlist(state, action) {
      const { list, movie } = action.payload;
      if (state.watchlists[list]) {
        state.watchlists[list].push(movie); // Add movie to the watchlist
        localStorage.setItem('watchlists', JSON.stringify(state.watchlists)); // Update localStorage
      }
    },
    removeFromWatchlist(state, action) {
      const { list, movieId } = action.payload;
      if (state.watchlists[list]) {
        state.watchlists[list] = state.watchlists[list].filter(movie => movie.imdbID !== movieId);
        localStorage.setItem('watchlists', JSON.stringify(state.watchlists)); // Update localStorage
      }
    },
  },
});

export const { login, logout, addToWatchlist, removeFromWatchlist } = userSlice.actions;

export default userSlice.reducer;
