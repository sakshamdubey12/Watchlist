import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { addToWatchlist } from '../redux/userSlice';
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { IoCloseOutline, IoBookmarksOutline } from "react-icons/io5";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [watchlists, setWatchlists] = useState([]); // Existing watchlists
  const [selectedList, setSelectedList] = useState('');
  const [creatingNewList, setCreatingNewList] = useState(false); // Flag to create new watchlist
  const [newListName, setNewListName] = useState(''); // New watchlist name
  const [newListDescription, setNewListDescription] = useState(''); // New watchlist description
  const [loadingMovies, setLoadingMovies] = useState(false); // Loading state for movies
  const [loadingWatchlists, setLoadingWatchlists] = useState(false); // Loading state for watchlists
  const dispatch = useDispatch();

  const searchMovies = async () => {
    setLoadingMovies(true);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?s=${query}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
      setMovies(response.data.Search);
    } catch (error) {
      console.error('Error fetching movies:', error);
      alert('Failed to load movies.');
    } finally {
      setLoadingMovies(false);
    }
  };

  const fetchWatchlists = async () => {
    setLoadingWatchlists(true);
    try {
      const response = await axios.get('http://localhost:3001/watchlists', {
        withCredentials: true, // Include cookies for user authentication
      });
      setWatchlists(response.data); // Assuming response.data contains an array of watchlists
    } catch (error) {
      console.error('Error fetching watchlists:', error);
      alert('Failed to load watchlists.');
    } finally {
      setLoadingWatchlists(false);
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, [watchlists]);

  const openModal = (movie) => {
    setSelectedMovie(movie);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setSelectedList('');
    setCreatingNewList(false);
    setNewListName('');
    setNewListDescription('');
  };

  const handleAddToList = async () => {
    if (creatingNewList) {
      if (newListName) {
        try {
          const response = await axios.post('http://localhost:3001/watchlists', {
            name: newListName,
            description: newListDescription,
          }, { withCredentials: true });

          const newWatchlist = response.data;
          setWatchlists([...watchlists, newWatchlist]);
          dispatch(addToWatchlist({ list: newWatchlist._id, movie: selectedMovie }));

          alert('Watchlist created and movie added!');
        } catch (error) {
          console.error('Error creating new watchlist:', error);
          alert('Failed to create new watchlist.');
        }
      } else {
        alert('Please provide a name for the new watchlist.');
      }
    } else {
      if (selectedList) {
        const movieWithList = { ...selectedMovie, list: selectedList };
        try {
          const response = await axios.post(`http://localhost:3001/watchlists/${selectedList}`, movieWithList, {
            withCredentials: true,
          });

          dispatch(addToWatchlist({ list: selectedList, movie: movieWithList }));
          alert(response.data.message || 'Movie added to watchlist!');
        } catch (error) {
          console.error('Error adding movie to watchlist:', error);
          alert('Failed to add movie to watchlist.');
        }
      } else {
        alert('Please select a watchlist or create a new one.');
      }
    }
    closeModal();
  };

  return (
    <div className="p-8 bg-white h-screen overflow-y-scroll">
      <div className='border border-red-700 rounded-md m-auto w-[92.5%] p-4'>
        <h3 className='text-3xl mb-8'>Welcome to <span className='text-red-500'>Watchlists</span></h3>
        <p className='my-2'>Browse movies, add them to watchlists and share them with friends</p>
      </div>
      <div className='relative w-[92.5%] m-auto flex mt-8'>
        <input
          type='text'
          placeholder='Search Movies...'
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className='w-[100%] border border-gray-300 p-2 rounded-md'
        />
        <button onClick={searchMovies} className='absolute right-0 border border-red-500 bg-red-500 px-4 py-2 rounded-md text-white'>
          Search
        </button>
      </div>

      {/* Movie results or loading spinner */}
      {loadingMovies ? (
        <p className="text-center mt-4">Loading movies...</p>
      ) : (
        <div className="grid grid-cols-4 m-auto gap-4 mt-8 w-[92.5%]">
          {movies?.map((movie) => (
            <div key={movie.imdbID} className="bg-white shadow-lg rounded-md overflow-hidden">
              <img src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
              <div className="p-4 relative">
                <h3 className="text-base font-semibold">{movie.Title}</h3>
                <p className="text-gray-500">{movie.Year}</p>
                <button onClick={() => openModal(movie)}>
                  <BsFillBookmarkPlusFill className='absolute top-0 right-4 scale-[200%] text-red-700' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white relative rounded-lg p-6 w-full max-w-md">
            <h2 className="text-2xl font-semibold mb-4">Add to List</h2>
            <form onSubmit={(e) => e.preventDefault()}>
          
                <>
                  {watchlists.length > 0 && !creatingNewList ? (
                    <>
                      <select
                        value={selectedList}
                        onChange={(e) => setSelectedList(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                      >
                        <option value="">Select Watchlist</option>
                        {watchlists.map((list) => (
                          <option key={list._id} value={list._id}>
                            {list.name}
                          </option>
                        ))}
                      </select>
                      <p className="text-gray-500 text-sm">Or <span className="text-blue-600 cursor-pointer" onClick={() => setCreatingNewList(true)}>create a new watchlist</span></p>
                    </>
                  ) : (
                    <>
                      {/* <p className="text-gray-500 text-sm">No watchlists available. Please create a new one below.</p> */}
                      <input
                        type="text"
                        placeholder="New List Name"
                        value={newListName}
                        onChange={(e) => setNewListName(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                      />
                      <input
                        type="text"
                        placeholder="New List Description"
                        value={newListDescription}
                        onChange={(e) => setNewListDescription(e.target.value)}
                        className="w-full p-2 border rounded mb-4"
                      />
                      <p className="text-gray-500 text-sm">Want to choose from existing lists? <span className="text-blue-600 cursor-pointer" onClick={() => setCreatingNewList(false)}>Select from existing</span></p>
                    </>
                  )}
                </>
          

              <div className="flex justify-end mt-6">
                <button
                  type="button"
                  className="flex items-center border gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black hover:border-black"
                  onClick={handleAddToList}
                >
                  <IoBookmarksOutline className='scale-[100%]' /><span className='text-sm'>Save</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2 absolute top-5 right-2 rounded"
                  onClick={closeModal}
                >
                  <IoCloseOutline className='scale-[200%]' />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieList;
