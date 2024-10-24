import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { addToWatchlist } from '../redux/userSlice';
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { IoCloseOutline, IoBookmarksOutline } from "react-icons/io5";
import axios from 'axios';
import MovieDetailsModal from './MovieDetailsModal'; // Import the new modal

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // New state for details modal
  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState('');
  const [movieDetails, setMovieDetails] = useState(null);
  const [creatingNewList, setCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [newListDescription, setNewListDescription] = useState('');
  const [loadingMovies, setLoadingMovies] = useState(false);
  const dispatch = useDispatch();

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

  const fetchMovieDetails = async (imdbID) => {
    // setLoadingDetails(true);
    try {
      const response = await axios.get(`http://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`);
      setMovieDetails(response.data); // Set detailed info into state
    } catch (error) {
      console.error('Error fetching movie details:', error);
      alert('Failed to load movie details.');
    } finally {
      // setLoadingDetails(false);
    }
  };

  const openDetailsModal = (movie) => {
    setSelectedMovie(movie);
    fetchMovieDetails(movie.imdbID)
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const handleAddToList = () => {
    const user = localStorage.getItem('currentUser');
    if (!user) {
      alert("No user logged in");
      return;
    }

    let updatedWatchlists = [...watchlists];

    // If creating a new list
    if (creatingNewList) {
      if (newListName) {
        const newWatchlist = {
          id: Date.now().toString(),
          name: newListName,
          description: newListDescription,
          movies: [selectedMovie],
        };

        updatedWatchlists = [...watchlists, newWatchlist];
        setWatchlists(updatedWatchlists);
        localStorage.setItem(`${user}_watchlists`, JSON.stringify(updatedWatchlists));
        dispatch(addToWatchlist({ list: newWatchlist.id, movie: selectedMovie }));
        alert('Watchlist created and movie added!');
      } else {
        alert('Please provide a name for the new watchlist.');
      }
    } else {
      if (selectedList) {
        const updatedWatchlist = updatedWatchlists.find((list) => list.id === selectedList);
        if (updatedWatchlist) {
          updatedWatchlist.movies.push(selectedMovie);
        }

        setWatchlists(updatedWatchlists);
        localStorage.setItem(`${user}_watchlists`, JSON.stringify(updatedWatchlists));
        dispatch(addToWatchlist({ list: selectedList, movie: selectedMovie }));
        alert('Movie added to watchlist!');
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

      {loadingMovies ? (
        <p className="text-center mt-4">Loading movies...</p>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 m-auto gap-4 mt-8 w-[92.5%]">
          {movies?.map((movie) => (
            <div key={movie.imdbID}  className="bg-white shadow-lg rounded-md overflow-hidden">
              <img onClick={() => openDetailsModal(movie)} src={movie.Poster} alt={movie.Title} className="w-full h-64 object-cover" />
              <div className="p-4 relative">
                <h3 className="text-base font-semibold">{movie.Title}</h3>
                <p className="text-gray-500">{movie.Year}</p>
                <button onClick={() => openModal(movie)} className="absolute top-0 right-4">
                  <BsFillBookmarkPlusFill className='text-red-700 scale-[200%]' />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Watchlist modal */}
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
                        <option key={list.id} value={list.id}>
                          {list.name}
                        </option>
                      ))}
                    </select>
                    <p className="text-gray-500 text-sm">Or <span className="text-blue-600 cursor-pointer" onClick={() => setCreatingNewList(true)}>create a new watchlist</span></p>
                  </>
                ) : (
                  <>
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
                  <IoCloseOutline className='scale-[120%]' />
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movie details modal */}
      {detailsModalOpen && movieDetails && (
        <MovieDetailsModal movie={movieDetails} onClose={closeDetailsModal} />
      )}
    </div>
  );
};

export default MovieList;
