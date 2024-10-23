import React, { useEffect, useState } from 'react';
import { logout } from "../redux/userSlice";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDelete } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from 'axios';
import { MdOutlineBookmarkAdd } from "react-icons/md";
import Modal from './Modal';
import { RiMovieLine } from "react-icons/ri";
const Sidebar = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState(''); // For the new watchlist description
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate

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
  
  useEffect(() => {
    fetchWatchlists();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get('http://localhost:3001/logout', {
        withCredentials: true, // Include cookies for user authentication
      });
      navigate('/');
    } catch (error) {
      console.error('Error while logout:', error);
      alert('Failed to logout.');
    }
  };

  const handleAddWatchlist = async (watchlistData) => {
    try {
      const response = await axios.post('http://localhost:3001/watchlists', watchlistData, {
        withCredentials: true,
      });
      
      setWatchlists(prev => [...prev, response.data.watchlist]);
      setNewListName(''); // Reset input field
      setNewListDescription(''); // Reset description field
      setIsModalOpen(false); // Close the modal
      alert('Watchlist created successfully!');
    } catch (error) {
      console.error('Failed to create watchlist:', error);
      alert('Failed to create watchlist.');
    }
  };

  const handleDelete = async (listId)=>{
    await axios.delete(`http://localhost:3001/watchlistDel/${listId}`, {
      withCredentials: true, // Include cookies for authentication
    });
    fetchWatchlists();
    navigate('/dashboard')
  }

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
          <div className='flex justify-between items-center mr-2'>
            <h2 className="font-semibold text-xl">My Lists</h2>
            <button onClick={() => setIsModalOpen(true)}>
              <MdOutlineBookmarkAdd className='scale-150 text-red-500 ' />
            </button>
          </div>
          {watchlists.map((list) => (
  <div
    key={list._id}
    onClick={() => navigate(`/dashboard/watchlist/${list._id}`)}
    className="flex relative gap-2 items-center cursor-pointer border border-gray-300 rounded-md p-1 my-2 hover:bg-gray-100 group" // Add hover effect to the container and group class
  >
    <RiMovieLine className='scale-150 ml-2 mr-4' />
    {list.name}
    <p 
      onClick={(e) => {
        handleDelete(list._id);
      }}
      className='absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300' // Show icon on hover using group-hover
    >
      <AiOutlineDelete className='scale-150 text-gray-400' />
    </p>
  </div>
))}

          {/* {watchlists.map((list) => (
            <div
              key={list._id}
              onClick={() => navigate(`/dashboard/watchlist/${list._id}`)}
              className="flex relative gap-2 items-center cursor-pointer border border-gray-300 rounded-md p-1 my-2"
            >
              <RiMovieLine className='scale-150 ml-2 mr-4' />
              {list.name}
              <p onClick={()=>handleDelete(list._id)} className='absolute right-2 opacity-0 hover:opacity-100 '><AiOutlineDelete className='scale-150 text-gray-400 ' /></p>
            </div>
          ))} */}
        </div>
        <div>
          <button onClick={handleLogout} className="text-red-500 hover:text-red-700">
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

      {/* Modal for adding watchlist */}
      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onAdd={handleAddWatchlist} 
        watchlistName={newListName}
        setWatchlistName={setNewListName}
        watchlistDescription={newListDescription}
        setWatchlistDescription={setNewListDescription}
      />
    </div>
  );
};

export default Sidebar;
