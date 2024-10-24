import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { RiEditBoxLine } from "react-icons/ri";

const Watchlist = () => {
  const { listId } = useParams();
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 
  const [isEditing, setIsEditing] = useState(false); // To toggle edit mode
  const [editedName, setEditedName] = useState(""); // Store edited name
  const [editedDescription, setEditedDescription] = useState(""); // Store edited description

  useEffect(() => {
    const fetchWatchlist = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/watchlists/watchlist/${listId}`, {
          withCredentials: true,
        });
        setWatchlist(response.data);
        setEditedName(response.data.name); // Initialize with existing name
        setEditedDescription(response.data.description || ""); // Initialize with existing description
      } catch (error) {
        console.error('Error fetching watchlist:', error);
        setError('Error fetching watchlist.');
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();
  }, [listId]);

  const handleSave = async () => {
    try {
      const updatedWatchlist = {
        name: editedName,
        description: editedDescription,
      };

      await axios.put(`http://localhost:3001/watchlists/watchlist/${listId}`, updatedWatchlist, {
        withCredentials: true,
      });

      setWatchlist((prevWatchlist) => ({
        ...prevWatchlist,
        ...updatedWatchlist,
      }));

      alert('Watchlist updated successfully!');
      setIsEditing(false); // Exit edit mode after saving
    } catch (error) {
      console.error('Error updating watchlist:', error);
      alert('Failed to update watchlist.');
    }
  };

  const removeFromWatchlist = async (imdbID) => {
    try {
      await axios.delete(`http://localhost:3001/watchlists/watchlist/${listId}/movie/${imdbID}`, {
        withCredentials: true,
      });

      setWatchlist((prevWatchlist) => ({
        ...prevWatchlist,
        movies: prevWatchlist.movies.filter((movie) => movie.imdbID !== imdbID),
      }));

      alert('Movie removed successfully!');
    } catch (error) {
      console.error('Failed to remove movie:', error);
      alert('Failed to remove movie.');
    }
  };


  const toggleWatched = async (movieId, currentStatus) => {
    try {
      await axios.post('http://localhost:3001/watchlists/markWatched', { movieId, listId }, {
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
    <div className="p-8 bg-white h-screen overflow-y-scroll">
      <div className='flex items-center gap-4'>
        {isEditing ? (
          <div>
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              className="text-2xl font-semibold border-b-2 outline-none"
            />
            <button onClick={handleSave} className="ml-2 border border-black bg-black p-1 px-2 text-sm rounded-md text-white hover:bg-white hover:text-black">Save</button>
            <button onClick={() => setIsEditing(false)} className="ml-2 border border-black bg-black p-1 px-2 text-sm rounded-md text-white hover:bg-white hover:text-black">Cancel</button>
          </div>
        ) : (
          <>
            <h2 className="text-3xl font-semibold">{watchlist.name}</h2>
            <RiEditBoxLine className='scale-[110%] cursor-pointer' onClick={() => setIsEditing(true)} />
          </>
        )}
      </div>
      <div className='my-8'>
        <h3 className='font-semibold my-2'>About this watchlist</h3>
        {isEditing ? (
          <textarea
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            className="w-full border-b-2 outline-none"
            rows="3"
          />
        ) : (
          <p>{watchlist.description || "No description available."}</p>
        )}
      </div>
      <div className="grid md:grid-cols-4 lg:grid-cols-4 sm:grid-cols-2 gap-4">
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
          <p>No movies found in this watchlist.</p>
        )}
      </div>
    </div>
  );
};

export default Watchlist;


  