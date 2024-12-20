import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDelete } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import Modal from "./Modal";
import { RiMovieLine } from "react-icons/ri";
import { useDispatch } from 'react-redux';
import { logout } from '../redux/userSlice';

const Sidebar = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const fetchWatchlists = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const user = users.find(u => u.email === currentUser);
      if (user && user.watchlist) {
        if (JSON.stringify(user.watchlist) !== JSON.stringify(watchlists)) {
          setWatchlists(user.watchlist);
        }
      }
    }
  };

  useEffect(() => {
    fetchWatchlists();


    const interval = setInterval(() => {
      fetchWatchlists();
    }, 2000); 
    return () => clearInterval(interval);
  }, []);

  const handleAddWatchlist = () => {
    const currentUser = localStorage.getItem('currentUser');
    if (!currentUser) {
      alert("No user is logged in.");
      return;
    }
  
    if (!newListName.trim()) {
      alert("Please provide a name for the watchlist.");
      return;
    }
  
    let users = JSON.parse(localStorage.getItem('users')) || [];
    let currentUserIndex = users.findIndex(u => u.email === currentUser);
  
    if (currentUserIndex !== -1) {
      if (!Array.isArray(users[currentUserIndex].watchlist)) {
        users[currentUserIndex].watchlist = [];
      }
        
      const newWatchlist = {
        id: Date.now().toString(),
        name: newListName.trim(),
        description: newListDescription.trim(),
        movies: []
      };
      
      users[currentUserIndex].watchlist.push(newWatchlist);
      localStorage.setItem('users', JSON.stringify(users));
      setWatchlists(users[currentUserIndex].watchlist);
      
      setNewListName("");
      setNewListDescription("");
      setIsModalOpen(false);
    } else {
      alert("User not found.");
    }
  };

  const handleDelete = (listId) => {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
      let users = JSON.parse(localStorage.getItem('users')) || [];
      let currentUserIndex = users.findIndex(u => u.email === currentUser);

      if (currentUserIndex !== -1) {
        users[currentUserIndex].watchlist = users[currentUserIndex].watchlist.filter(
          list => list.id !== listId
        );
        
        localStorage.setItem('users', JSON.stringify(users));
        setWatchlists(prevWatchlists => prevWatchlists.filter(list => list.id !== listId));
        navigate("/dashboard");
      }
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  return (
    <div className="w-[100%] h-screen bg-white overflow-hidden">
      <div className="flex flex-col items-center border-b-2 pb-6">
        <h2 className="text-red-500 text-4xl font-bold text-center mt-5">Watchlists</h2>
        <div className="w-[80%] mt-4">
          <input
            type="text"
            placeholder="Search movies..."
            className="border-2 py-1 px-2 rounded-lg w-[100%]"
          />
        </div>
        <div className="w-[80%] mt-8">
          <p
            onClick={() => navigate(`/dashboard`)}
            className="flex items-center space-x-2 p-1 border-2 border-red-500 bg-red-500 text-white hover:bg-red-100 rounded w-[100%]"
          >
            <span><FaHome /></span>
            <span>Home</span>
          </p>
        </div>
      </div>

      <div className="flex flex-col justify-between px-8 py-4 h-[65%]">
        <div className="overflow-y-auto">
          <div className="flex justify-between items-center mr-2">
            <h2 className="font-semibold text-xl">My Lists</h2>
            <button onClick={() => setIsModalOpen(true)}>
              <MdOutlineBookmarkAdd className="scale-150 text-red-500" />
            </button>
          </div>
          {watchlists.map((list) => (
            <div
              key={list.id}
              onClick={() => navigate(`/dashboard/watchlist/${list.id}`)}
              className="flex relative gap-2 items-center cursor-pointer border border-gray-300 rounded-md p-1 my-2 hover:bg-gray-100 group"
            >
              <RiMovieLine className="scale-150 ml-2 mr-4" />
              {list.name}
              <p
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(list.id);
                }}
                className="absolute right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <AiOutlineDelete className="scale-150 text-gray-400" />
              </p>
            </div>
          ))}
        </div>
        <div>
          <button
            onClick={handleLogout}
            className="text-red-500 hover:text-red-700"
          >
            <FontAwesomeIcon icon={faSignOutAlt} className="mr-2" />
            Logout
          </button>
        </div>
      </div>

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
