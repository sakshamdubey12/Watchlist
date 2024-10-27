import React, { useEffect, useState } from "react";
import { BsFillBookmarkPlusFill } from "react-icons/bs";
import { IoCloseOutline, IoBookmarksOutline } from "react-icons/io5";
import axios from "axios";
import MovieDetailsModal from "./MovieDetailsModal";

const MovieList = () => {
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMovie, setSelectedMovie] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [watchlists, setWatchlists] = useState([]);
  const [selectedList, setSelectedList] = useState("");
  const [movieDetails, setMovieDetails] = useState(null);
  const [creatingNewList, setCreatingNewList] = useState(false);
  const [newListName, setNewListName] = useState("");
  const [newListDescription, setNewListDescription] = useState("");
  const [loadingMovies, setLoadingMovies] = useState(false);

  const fetchWatchlists = () => {
    const userEmail = localStorage.getItem("currentUser");
    if (userEmail) {
      const users = JSON.parse(localStorage.getItem("users")) || [];
      const currentUser = users.find((u) => u.email === userEmail);
      if (currentUser?.watchlist) {
        setWatchlists(currentUser.watchlist);
      } else {
        setWatchlists([]);
      }
    }
  };

  useEffect(() => {
    fetchWatchlists();
  }, []);

  const searchMovies = async () => {
    setLoadingMovies(true);
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?s=${query}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      setMovies(response.data.Search);
    } catch (error) {
      console.error("Error fetching movies:", error);
      alert("Failed to load movies.");
    } finally {
      setLoadingMovies(false);
    }
  };

  const openModal = (movie) => {
    
    setSelectedMovie(movie);
    setCreatingNewList(true);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMovie(null);
    setSelectedList("");
    setCreatingNewList(false);
    setNewListName("");
    setNewListDescription("");
  };

  const fetchMovieDetails = async (imdbID) => {
    try {
      const response = await axios.get(
        `https://www.omdbapi.com/?i=${imdbID}&apikey=${process.env.REACT_APP_OMDB_API_KEY}`
      );
      setMovieDetails(response.data);
    } catch (error) {
      console.error("Error fetching movie details:", error);
      alert("Failed to load movie details.");
    }
  };

  const openDetailsModal = (movie) => {
    setSelectedMovie(movie);
    fetchMovieDetails(movie.imdbID);
    setDetailsModalOpen(true);
  };

  const closeDetailsModal = () => {
    setDetailsModalOpen(false);
    setSelectedMovie(null);
    setMovieDetails(null);
  };

  const handleAddToList = () => {
    const userEmail = localStorage.getItem("currentUser");
    if (!userEmail) {
      alert("No user logged in");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];
    let currentUserIndex = users.findIndex((u) => u.email === userEmail);

    if (currentUserIndex === -1) {
      alert("User not found.");
      return;
    }

    if (!Array.isArray(users[currentUserIndex].watchlist)) {
      users[currentUserIndex].watchlist = [];
    }

    if (creatingNewList) {
      if (!newListName.trim()) {
        alert("Please provide a name for the new watchlist.");
        return;
      }

      // Check for duplicate watchlist name
      const isDuplicateName = users[currentUserIndex].watchlist.some(
        list => list.name.toLowerCase() === newListName.trim().toLowerCase()
      );

      if (isDuplicateName) {
        alert("A watchlist with this name already exists.");
        return;
      }

      const newWatchlist = {
        id: Date.now().toString(),
        name: newListName.trim(),
        description: newListDescription.trim(),
        movies: selectedMovie ? [selectedMovie] : []
      };

      users[currentUserIndex].watchlist.push(newWatchlist);
      localStorage.setItem("users", JSON.stringify(users));
      setWatchlists(users[currentUserIndex].watchlist);
      alert("New watchlist created" + (selectedMovie ? " and movie added!" : "!"));

    } else {
      if (!selectedList) {
        alert("Please select a watchlist or create a new one.");
        return;
      }

      const watchlistIndex = users[currentUserIndex].watchlist.findIndex(
        (list) => list.id === selectedList
      );

      if (watchlistIndex === -1) {
        alert("Selected watchlist not found.");
        return;
      }

      // Check for duplicate movie
      const movieExists = users[currentUserIndex].watchlist[watchlistIndex].movies?.some(
        (m) => m.imdbID === selectedMovie.imdbID
      );

      if (movieExists) {
        alert("This movie is already in the selected watchlist!");
        return;
      }

      if (!Array.isArray(users[currentUserIndex].watchlist[watchlistIndex].movies)) {
        users[currentUserIndex].watchlist[watchlistIndex].movies = [];
      }

      users[currentUserIndex].watchlist[watchlistIndex].movies.push(selectedMovie);
      localStorage.setItem("users", JSON.stringify(users));
      setWatchlists(users[currentUserIndex].watchlist);
      alert("Movie added to watchlist!");
    }

    closeModal();
  };

  return (
    <div className="p-8 bg-white h-screen overflow-y-scroll">
      <div className="border border-red-700 rounded-md m-auto w-[92.5%] p-4">
        <h3 className="text-3xl mb-8">
          Welcome to <span className="text-red-500">Watchlists</span>
        </h3>
        <p className="my-2">
          Browse movies, add them to watchlists and share them with friends
        </p>
      </div>
      <div className="relative w-[92.5%] m-auto flex mt-8">
        <input
          type="text"
          placeholder="Search Movies..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-[100%] border border-gray-300 p-2 rounded-md"
        />
        <button
          onClick={searchMovies}
          className="absolute right-0 border border-red-500 bg-red-500 px-4 py-2 rounded-md text-white"
        >
          Search
        </button>
      </div>

      {loadingMovies ? (
        <p className="text-center mt-4">Loading movies...</p>
      ) : (
        <div className="grid lg:grid-cols-4 md:grid-cols-2 sm:grid-cols-2 m-auto gap-4 mt-8 w-[92.5%]">
          {movies?.map((movie) => (
            <div
              key={movie.imdbID}
              className="bg-white shadow-lg rounded-md overflow-hidden"
            >
              <img
                onClick={() => openDetailsModal(movie)}
                src={movie.Poster}
                alt={movie.Title}
                className="w-full h-64 object-cover hover:cursor-pointer "
              />
              <div className="p-4 relative">
                <h3 className="text-base font-semibold">{movie.Title}</h3>
                <p className="text-gray-500">{movie.Year}</p>
                <button
                  onClick={() => openModal(movie)}
                  className="absolute top-0 right-4"
                >
                  <BsFillBookmarkPlusFill className="text-red-700 scale-[200%]" />
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
                    <p className="text-gray-500 text-sm">
                      Or{" "}
                      <span
                        className="text-blue-600 cursor-pointer"
                        onClick={() => setCreatingNewList(false)}
                      >
                        create a new watchlist
                      </span>
                    </p>
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
                 
                    <p className="text-gray-500 text-sm"
                    onClick={() => setCreatingNewList(false)}
                    >
                      Want to choose from existing lists?{" "}
                      <span
                        className="text-blue-600 cursor-pointer"
                         
                      >Select from existing
                      </span>
                    </p>
                 
                  </>
                )}
              </>

              <div  className="flex justify-end mt-6">
                <button
                  type="button"
                  className="flex items-center border gap-2 px-4 py-2 bg-black text-white rounded-md hover:bg-white hover:text-black hover:border-black"
                  onClick={handleAddToList}
                        
                >
                  <IoBookmarksOutline className="scale-[100%]" />
                  <span className="text-sm">Save</span>
                </button>
                <button
                  type="button"
                  className="px-4 py-2 absolute top-5 right-2 rounded"
                  onClick={closeModal}
                >
                  <IoCloseOutline className="scale-[120%]" />
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
