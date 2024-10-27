import React from 'react';
import { IoBookmarksOutline } from "react-icons/io5";

const Modal = ({ 
  isOpen, 
  onClose, 
  onAdd, 
  watchlistName, 
  setWatchlistName, 
  watchlistDescription, 
  setWatchlistDescription 
}) => {
  if (!isOpen) return null;

  const handleAdd = (e) => {
    e.preventDefault(); 
    
    if (!watchlistName.trim()) {
      alert("Please enter a watchlist name.");
      return;
    }
    
    // Just call onAdd - all logic will be in Sidebar
    onAdd();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 w-[90%] md:w-1/3 lg:w-1/3">
        <h3 className="text-lg font-semibold mb-4">Create New Watchlist</h3>
        <form onSubmit={handleAdd}>
          <input
            type="text"
            placeholder="Watchlist Name"
            value={watchlistName}
            onChange={(e) => setWatchlistName(e.target.value)}
            className="border py-1 px-2 mb-2 rounded w-full"
            required
          />
          <textarea
            placeholder="Watchlist Description (optional)"
            value={watchlistDescription}
            onChange={(e) => setWatchlistDescription(e.target.value)}
            className="border py-1 px-2 mb-2 rounded w-full"
            rows="3"
          />
          <div className="flex justify-end text-sm">
            <button
              type="button"  
              onClick={onClose}
              className="mr-2 bg-gray-300 text-gray-700 py-1 px-4 rounded hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-2 bg-black text-white border border-black hover:text-black hover:bg-white rounded-md py-1 px-4"
            >
              <IoBookmarksOutline />
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Modal;
