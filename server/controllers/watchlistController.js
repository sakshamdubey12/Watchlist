const User = require('../models/userModel')
const Watchlist = require('../models/watchlistModel')

exports.getWatchlists = async (req, res) => {
    try {
      const user = await User.findOne({email:req.user.email})
      const watchlists = await Watchlist.find({ user: user._id }); // Fetch only for the user
      res.status(200).json(watchlists);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching watchlists.' });
    }
  }

exports.getWatchlist = async (req, res) => {
    try { 
        // Find the watchlist by ID and ensure it belongs to the logged-in user
        const watchlist = await Watchlist.findOne({ _id: req.params.id}); 
        
        // Check if the watchlist exists
        if (!watchlist) {
            return res.status(404).json({ message: 'Watchlist not found.' });
        }
        
        res.status(200).json(watchlist); // Return the watchlist data
    } catch (error) {
        console.error('Error fetching watchlist:', error); // Log the error for debugging
        res.status(500).json({ message: 'Error fetching watchlist.' }); // Return a server error response
    }
}

exports.updateWatchlist = async (req, res) => {
    const { listId } = req.params;
    const { name, description } = req.body;
  
    try {
      // Find the watchlist by ID and update it
      const updatedWatchlist = await Watchlist.findOneAndUpdate(
        { _id: listId },
        { name, description },
        { new: true, runValidators: true } // Return the updated document
      );
  
      if (!updatedWatchlist) {
        return res.status(404).json({ message: 'Watchlist not found' });
      }
  
      res.status(200).json({ message: 'Watchlist updated successfully', watchlist: updatedWatchlist });
    } catch (error) {
      res.status(500).json({ message: 'Error updating watchlist', error: error.message });
    }
  }

exports.deleteMovie = async (req, res) => {
    const { listId, imdbID } = req.params;
    try {
      // Find the watchlist by ID and remove the movie with the specified imdbID
      const watchlist = await Watchlist.findByIdAndUpdate(
        listId,
        { $pull: { movies: { imdbID } } }, // Pull movie from the movies array
        { new: true } // Return the updated watchlist
      );
  
      if (!watchlist) {
        return res.status(404).json({ message: 'Watchlist not found' });
      }
  
      res.status(200).json({ watchlist, message: 'Movie removed from watchlist' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove movie', error });
    }
  }

exports.deleteWatchList = async (req, res) => {
    const { listId } = req.params;
    try {
      // Find the watchlist by ID and remove the movie with the specified imdbID
      const WatchList = await Watchlist.findOneAndDelete({_id:listId})
      res.status(200).json({ message: 'removed watchlist' });
    } catch (error) {
      res.status(500).json({ message: 'Failed to remove watchlist', error });
    }
  }

exports.createWatchlist = async (req, res) => {
    console.log(req.user)
    const { name, description } = req.body;
    console.log(req.body)
    const user = await User.findOne({email:req.user.email}) // Assuming you're storing user id in the request after login

    try {
        const newWatchlist = new Watchlist({ name, description, user: user._id });
        await newWatchlist.save();
        await User.findByIdAndUpdate(user._id, { $push: { watchlists: newWatchlist._id } });

        res.status(201).json({ message: 'Watchlist created successfully', watchlist: newWatchlist });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create watchlist', error: error.message });
    }
}


exports.toggleStatus = async (req, res) => {
    const { movieId, listId } = req.body;
  
    try {
      // Find the watchlist by its ID
      const watchList = await Watchlist.findOne({ _id: listId });
      if (!watchList) {
        return res.status(404).json({ message: 'Watchlist not found' });
      }
  
      // Find the movie inside the watchlist's movies array and update its watched status
      const movie = watchList.movies.find((movie) => movie.imdbID === movieId);
      if (!movie) {
        return res.status(404).json({ message: 'Movie not found in the watchlist' });
      }
  
      movie.watched = !movie.watched; // Update watched status to true
  
      // Save the updated watchlist back to the database
      await watchList.save();
  
      return res.status(200).json({ message: 'Movie marked as watched successfully', watchList });
    } catch (error) {
      console.error('Error marking movie as watched:', error);
      return res.status(500).json({ message: 'Failed to mark movie as watched' });
    }
  }

// exports.addMovie = async (req, res) => {
//     const { listId } = req.params;
//     const {imdbID } = req.body;
//     console.log(req.body.Title)
//     try {
//       const watchlist = await Watchlist.findById(listId);
//       watchlist.movies.push({ title: req.body.Title, year:req.body.Year, imdbID,poster:req.body.Poster,watched:false });

//       await watchlist.save();
//       res.status(200).json({ message: 'Movie added to watchlist!' });
//     } catch (error) {
//       res.status(500).json({ message: 'Error adding movie to watchlist.' });
//     }
//   }

exports.addMovie = async (req, res) => {
  const { listId } = req.params;
  const { imdbID } = req.body;
  
  try {
      const watchlist = await Watchlist.findById(listId);

      // Check if the movie is already in the watchlist
      const movieExists = watchlist.movies.some(movie => movie.imdbID === imdbID);

      if (movieExists) {
          return res.status(202).json({ message: 'Movie is already in the watchlist.' });
      }

      // If not, add the movie to the watchlist
      watchlist.movies.push({
          title: req.body.Title,
          year: req.body.Year,
          imdbID,
          poster: req.body.Poster,
          watched: false
      });

      await watchlist.save();
      res.status(200).json({ message: 'Movie added to watchlist!' });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ message: 'Error adding movie to watchlist.' });
  }
}

