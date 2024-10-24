import React, { useEffect } from 'react';
import MovieList from './components/MovieList';
import Watchlist from './components/Watchlist';
import Login from './pages/Login';
import Dashboard from './pages/Dashborad'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {


  return (
    <div className="flex h-screen w-[100%] bg-slate-300">
        <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<MovieList />} />
          <Route path="watchlist/:listId" element={<Watchlist />} /> {/* Nested route */}
        </Route>
        </Routes>
    </div>
  );
}

export default App;
