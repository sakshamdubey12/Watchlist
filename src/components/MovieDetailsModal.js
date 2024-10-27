import React from 'react';
import { IoCloseOutline } from "react-icons/io5";

const MovieDetailsModal = ({ movie, onClose }) => {
  if (!movie) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white relative rounded-lg p-6 w-[90%] max-w-md">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <IoCloseOutline size={24} />
        </button>
        <h2 className="text-2xl font-semibold mb-4">{movie.Title}</h2>
        {movie.Poster !== "N/A" && (
          <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover mb-4 rounded" />
        )}
        <div className="space-y-2">
          <p><strong>Year:</strong> {movie.Year}</p>
          <p><strong>Plot:</strong> {movie.Plot || "No plot available."}</p>
          <p><strong>Genre:</strong> {movie.Genre || "Not specified"}</p>
          <p><strong>Runtime:</strong> {movie.Runtime || "Not specified"}</p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
