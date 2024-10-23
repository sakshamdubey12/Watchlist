import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { RiEditBoxLine } from "react-icons/ri";

const Watchlist = () => {
  const { listId } = useParams();
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true); // To track loading state
  const [error, setError] = useState(null); // To track any error

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/watchlist/${listId}`, {
          withCredentials: true,
        }); // Fetch the watchlist by ID
        setWatchlist(response.data); // Set the fetched watchlist
        console.log("Fetched watchlist:", response.data); // Debugging: Check fetched data
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Error fetching watchlist.'); // Set error state
      } finally {
        setLoading(false); // Set loading to false after fetch attempt
      }
    };

    fetchWatchlist();
  }, [listId]);

  const removeFromWatchlist = async (imdbID) => {
    try {
      await axios.delete(`http://localhost:3001/watchlist/${listId}/movie/${imdbID}`, {
        withCredentials: true, // Include cookies for authentication
      });

      // Update the local state by filtering out the removed movie
      setWatchlist((prevWatchlist) => ({
        ...prevWatchlist,
        movies: prevWatchlist.movies.filter((movie) => movie.imdbID !== imdbID)
      }));

      alert('Movie removed successfully!');
    } catch (error) {
      console.error('Failed to remove movie:', error);
      alert('Failed to remove movie.');
    }
  };

  const toggleWatched = async (movieId, currentStatus) => {
    try {
      await axios.post('http://localhost:3001/markWatched', { movieId, listId }, {
        withCredentials: true,
      });

      // Update the watchlist state in real-time
      setWatchlist((prevWatchlist) => ({
        ...prevWatchlist,
        movies: prevWatchlist.movies.map((movie) =>
          movie.imdbID === movieId ? { ...movie, watched: !currentStatus } : movie
        )
      }));
    } catch (error) {
      console.error('Error updating watched status:', error);
      alert('Failed to update movie status.');
    }
  };

  if (loading) return <div>Loading...</div>; // Show loading state
  if (error) return <div>{error}</div>; // Show error message if any

  return (
    <div className="p-8 bg-white h-screen">
      <div className='flex items-center gap-4'>
        <RiEditBoxLine className='scale-[110%]' />
        <h2 className="text-3xl font-semibold">{watchlist.name}</h2>
      </div>
      <div className='my-8'>
        <h3 className='font-semibold my-2'>About this watchlist</h3>
        <p>{watchlist.description || "No description available."}</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {watchlist.movies && watchlist.movies.length > 0 ? (
          watchlist.movies.map((movie) => (
            <div key={movie.imdbID} className="bg-white relative shadow-md rounded-lg overflow-hidden">
              <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover" />
              <div className="p-4 relative">
                <h3 className="text-base font-semibold">{movie.title}</h3>
                <p className="text-gray-500 mb-9">{movie.year}</p>
                <button
                  onClick={() => removeFromWatchlist(movie.imdbID)}
                  className="absolute bottom-2 w-[85%] bg-red-500 text-white py-1 px-4 rounded"
                >
                  Remove 
                </button>
                <button  onClick={()=>toggleWatched(movie.imdbID,movie.watched)}>
                  <BsFillBookmarkCheckFill className={`absolute top-0 right-4 scale-[200%] ${movie.watched?'text-green-600': 'text-gray-500'}  `} />
              </button>
              </div>
            </div>
          ))
        ) : (
          <p>No movies found in this watchlist.</p> // Fallback if no movies
        )}
      </div>
    </div>
  );
};

export default Watchlist;
