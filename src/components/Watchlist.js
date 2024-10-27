import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { RiEditBoxLine } from "react-icons/ri";

const Watchlist = () => {
  const { listId } = useParams();
  const [watchlist, setWatchlist] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState("");
  const [editedDescription, setEditedDescription] = useState("");

  useEffect(() => {
    const fetchWatchlist = () => {
      const currentUserEmail = localStorage.getItem('currentUser');
      if (currentUserEmail) {
        const users = JSON.parse(localStorage.getItem('users')) || [];
        const currentUser = users.find(user => user.email === currentUserEmail);
        if (currentUser) {
          const currentWatchlist = currentUser.watchlist.find((list) => list.id === listId);
          if (currentWatchlist) {
            setWatchlist(currentWatchlist);
            setEditedName(currentWatchlist.name);
            setEditedDescription(currentWatchlist.description || "");
          } else {
            setError('Watchlist not found.');
          }
        } else {
          setError('User not found.');
        }
      }
      setLoading(false);
    };

    fetchWatchlist();
  }, [listId]);

    const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(
        `http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      alert("Failed to load movie details.");
    }
  };

  const handleSave = () => {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail && watchlist) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);
      if (currentUserIndex !== -1) {
        const updatedWatchlists = users[currentUserIndex].watchlist.map((list) =>
          list.id === listId ? { ...list, name: editedName, description: editedDescription } : list
        );

        users[currentUserIndex].watchlist = updatedWatchlists;
        localStorage.setItem('users', JSON.stringify(users));

        setWatchlist((prevWatchlist) => ({
          ...prevWatchlist,
          name: editedName,
          description: editedDescription,
        }));
        alert('Watchlist updated successfully!');
        setIsEditing(false);
      }
    }
  };

  const removeFromWatchlist = (imdbID) => {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail && watchlist) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);
      if (currentUserIndex !== -1) {
        const updatedWatchlists = users[currentUserIndex].watchlist.map((list) =>
          list.id === listId
            ? { ...list, movies: list.movies.filter((movie) => movie?.imdbID !== imdbID) }
            : list
        );

        users[currentUserIndex].watchlist = updatedWatchlists;
        localStorage.setItem('users', JSON.stringify(users));

        setWatchlist((prevWatchlist) => ({
          ...prevWatchlist,
          movies: prevWatchlist.movies.filter((movie) => movie?.imdbID !== imdbID),
        }));
        alert('Movie removed successfully!');
      }
    }
  };

  const toggleWatched = (movieId, currentStatus) => {
    const currentUserEmail = localStorage.getItem('currentUser');
    if (currentUserEmail && watchlist) {
      const users = JSON.parse(localStorage.getItem('users')) || [];
      const currentUserIndex = users.findIndex(user => user.email === currentUserEmail);
      if (currentUserIndex !== -1) {
        const updatedWatchlists = users[currentUserIndex].watchlist.map((list) =>
          list.id === listId
            ? {
                ...list,
                movies: list.movies.map((movie) =>
                  movie.imdbID === movieId ? { ...movie, watched: !currentStatus } : movie
                ),
              }
            : list
        );

        users[currentUserIndex].watchlist = updatedWatchlists;
        localStorage.setItem('users', JSON.stringify(users));

        setWatchlist((prevWatchlist) => ({
          ...prevWatchlist,
          movies: prevWatchlist.movies.map((movie) =>
            movie?.imdbID === movieId ? { ...movie, watched: !currentStatus } : movie
          ),
        }));
      }
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

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
            <button onClick={handleSave} className="ml-2 border border-black bg-black p-1 px-2 text-sm rounded-md text-white hover:bg-white hover:text-black">
              Save
            </button>
            <button onClick={() => setIsEditing(false)} className="ml-2 border border-black bg-black p-1 px-2 text-sm rounded-md text-white hover:bg-white hover:text-black">
              Cancel
            </button>
          </div>
        ) : (
          <>
            <h2 className="text-4xl font-semibold">{watchlist.name}</h2>
            <RiEditBoxLine className='scale-[110%] cursor-pointer' onClick={() => setIsEditing(true)} />
          </>
        )}
      </div>
      <div className='my-8'>
        <h3 className='font-semibold my-2'>About this watchlist:</h3>
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
            <div key={movie?.imdbID} className="bg-white relative shadow-md rounded-lg overflow-hidden">
              <img src={movie?.Poster} alt={movie?.Title} className="w-full h-64 object-cover hover:cursor-pointer" />
              <div className="p-4 relative">
                <h3 className="text-base font-semibold">{movie?.Title}</h3>
                <p className="text-gray-500 mb-9">{movie?.Year}</p>
                <button
                  onClick={() => removeFromWatchlist(movie?.imdbID)}
                  className="absolute bottom-2 w-[85%] bg-red-500 text-white py-1 px-4 rounded"
                >
                  Remove 
                </button>
                <button onClick={() => toggleWatched(movie?.imdbID, movie?.watched)}>
                  <BsFillBookmarkCheckFill className={`absolute top-0 right-4 scale-[200%] ${movie?.watched ? 'text-green-600' : 'text-gray-500'}`} />
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
