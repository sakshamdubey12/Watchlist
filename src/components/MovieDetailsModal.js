// MovieDetailsModal.js
import React from 'react';

const MovieDetailsModal = ({ movie, onClose }) => {
    console.log({movie})
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white relative rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-semibold mb-4">{movie.Title}</h2>
        <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover mb-4" />
        <p><strong>Year:</strong> {movie.Year}</p>
        <p><strong>Plot:</strong> {movie.Plot || "No plot available."}</p>
        <p><strong>Genre:</strong> {movie.Genre}</p>
        <p><strong>Runtime:</strong> {movie.Runtime}</p>
        <div className="flex justify-end mt-6">
          <button
            type="button"
            className="px-4 py-2 bg-red-500 text-white rounded"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default MovieDetailsModal;
