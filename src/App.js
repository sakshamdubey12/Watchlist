import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import MovieList from './components/MovieList';
import Watchlist from './components/Watchlist';
import Login from './pages/Login';
import { login, logout } from './redux/userSlice';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashborad'

import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
function App() {
  const dispatch = useDispatch();
  const { email } = useSelector((state) => state.user);

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      dispatch(login(storedEmail)); // Log in the user if an email is found in localStorage
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logout()); // Assuming you have a logout action
    localStorage.removeItem('email'); // Clear email from localStorage
  };

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
