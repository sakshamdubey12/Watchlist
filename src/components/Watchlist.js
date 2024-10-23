import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { RiEditBoxLine } from "react-icons/ri";
const Watchlist = () => {
  const { listId } = useParams();
  const [watchlist, setWatchlist] = useState(null);

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/watchlist/${listId}`,{
          withCredentials: true, 
        }); // Fetch the watchlist by ID
        setWatchlist(response.data); // Set the fetched watchlist
        console.log(watchlist.movies)
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      }
    };

    fetchWatchlist();
  }, [listId]);

  const removeFromWatchlist = async (imdbID) => {
    try {
      const response = await axios.delete(`http://localhost:3001/watchlist/${listId}/movie/${imdbID}`, {
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

  return (
    <div className="p-8 bg-white h-screen">
      <div className='flex items-center gap-4'>
        <h2 className="text-3xl font-semibold">{watchlist.name}</h2>
        <RiEditBoxLine className='scale-[110%]' />
      </div>
      <div className='my-8'>
        <h3 className='font-semibold my-2'>About this watchlist</h3>
        <p>lorem ipsum jkahd sehhf rsfh kj</p>
      </div>
      <div className="grid grid-cols-4 gap-4">
        {watchlist.movies.map((movie) => (
          <div key={movie.imdbID} className="bg-white relative shadow-md rounded-lg overflow-hidden">
            <img src={movie.poster} alt={movie.title} className="w-full h-64 object-cover" />
            <div className="p-4">
              <h3 className="text-lg font-semibold">{movie.title}</h3>
              <p className="text-gray-500 mb-9">{movie.year}</p>
              
              <button
                onClick={() => removeFromWatchlist(movie.imdbID)}
                className="absolute bottom-2 w-[85%] bg-red-500 text-white py-1 px-4 rounded"
              >
                Remove 
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Watchlist;
