import React, { useEffect, useState } from 'react';
import { logout } from "../redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { useDispatch } from "react-redux";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { RiMovieLine } from "react-icons/ri";
const Sidebar = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    const fetchWatchlists = async () => {
      try {
        const response = await axios.get('http://localhost:3001/watchlists', {
          withCredentials: true, // Include cookies for user authentication
        });
        setWatchlists(response.data);
      } catch (error) {
        console.error('Error fetching watchlists:', error);
        alert('Failed to load watchlists.');
      }
    };
    
    fetchWatchlists();
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("email");
  };

  const handleAddWatchlist = async () => {
    if (!newListName) {
      alert('Please enter a name for the new watchlist.');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/watchlists', { name: newListName }, {
        withCredentials: true, // Include cookies with the request
      });
      
      // If successful, add the new watchlist to the state
      setWatchlists(prev => [...prev, response.data.watchlist]); // Add new watchlist to the state
      setNewListName(''); // Reset input field
      alert('Watchlist created successfully!'); // Notify user
    } catch (error) {
      console.error('Failed to create watchlist:', error);
      alert('Failed to create watchlist.');
    }
  };

  return (
    <div className="w-[100%] h-screen bg-white overflow-hidden">
      <div className="flex flex-col items-center border-b-2 pb-6">
        <h2 className="text-red-500 text-4xl font-bold text-center mt-5">Watchlists</h2>
        <div className="w-[80%] mt-4">
          <input type="text" placeholder="Search movies..." className="border-2 py-1 px-2 rounded-lg w-[100%]" />
        </div>
        <div className="w-[80%] mt-8">
          <p onClick={() => navigate(`/dashboard`)} className="flex items-center space-x-2 p-1 border-2 border-red-500 bg-red-500 text-white hover:bg-red-100 rounded w-[100%]">
            <span><FaHome /></span>
            <span>Home</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between px-8 py-4 h-[65%]">
        <div className='overflow-y-auto'>
          <h2 className="font-semibold text-xl">My Lists</h2>
          {watchlists.map((list) => (
            <p
              key={list._id}
              onClick={() => navigate(`/dashboard/watchlist/${list._id}`)} // Navigate to watchlist page
              className="flex gap-2  items-center cursor-pointer border border-gray-300 rounded-md p-1 my-2 "
            >
              <RiMovieLine className='scale-150 ml-2 mr-4' />
              {list.name}
            </p>
          ))}
          
         
        </div>
        <div>
           {/* New Watchlist Creation Section */}
           <div className="flex items-center mb-4">
            
            <input
              type="text"
              value={newListName}
              onChange={(e) => setNewListName(e.target.value)}
              placeholder="Enter new watchlist name"
              className="border py-1 px-2 text-xs rounded w-[100%] "
            />
            <button
              onClick={handleAddWatchlist}
              className=" bg-red-500 text-xs mx-2 text-white py-1 px-4 rounded hover:bg-red-700"
            >
              Add
            </button>
          </div>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
