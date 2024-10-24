import React, { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { AiOutlineDelete } from "react-icons/ai";
import { FaHome } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { MdOutlineBookmarkAdd } from "react-icons/md";
import Modal from "./Modal";
import { RiMovieLine } from "react-icons/ri";

const Sidebar = () => {
  const [watchlists, setWatchlists] = useState([]);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();

  // Function to fetch watchlists from localStorage
  const fetchWatchlists = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const storedWatchlists = JSON.parse(localStorage.getItem(`${user}_watchlists`)) || [];
      setWatchlists(storedWatchlists);
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    navigate("/");
  };

  const handleAddWatchlist = () => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const newWatchlist = {
        id: Date.now().toString(), // Unique ID for the watchlist
        name: newListName,
        description: newListDescription,
      };

      const storedWatchlists = JSON.parse(localStorage.getItem(`${user}_watchlists`)) || [];
      const updatedWatchlists = [...storedWatchlists, newWatchlist];

      // Save the updated watchlist back to localStorage
      localStorage.setItem(`${user}_watchlists`, JSON.stringify(updatedWatchlists));
      setWatchlists(updatedWatchlists); // Update state
      setNewListName("");
      setNewListDescription("");
      setIsModalOpen(false);
      alert("Watchlist created successfully!");
    }
  };

  const handleDelete = (listId) => {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const storedWatchlists = JSON.parse(localStorage.getItem(`${user}_watchlists`)) || [];
      const updatedWatchlists = storedWatchlists.filter((list) => list.id !== listId);

      // Update localStorage and state
      localStorage.setItem(`${user}_watchlists`, JSON.stringify(updatedWatchlists));
      setWatchlists(updatedWatchlists);
      navigate("/dashboard");
    }
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
              <MdOutlineBookmarkAdd className="scale-150 text-red-500 " />
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
