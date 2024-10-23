const express = require('express');
const User = require('./models/userModel');
const Watchlist = require('./models/watchlistModel')
const cors = require('cors');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const cookieParser = require('cookie-parser');
const JWT_SECRET = 'your_jwt_secret_key';
const isLoggedIn = require('./isLoggedIn')
require('./db');

const app = express();

const corsOptions = {
    origin: 'http://localhost:3000', // Your frontend URL
    credentials: true, // Allow credentials (cookies) to be sent
};

app.use(cors(corsOptions));
app.use(express.json()); // Parse JSON bodies
app.use(bodyParser.json());
app.use(cookieParser()); 

app.get('/', (req, res) => {
    res.send("working");
});

// Signup endpoint
app.post('/signup', async (req, res) => {
    const { email } = req.body;
    // Check if the user already exists
    const user = await User.findOne({ email });
    if (!user) {
        // Create a new user if it doesn't exist
        console.log(email)

        await User.create({ 
            email,
            watchlists: []
         });
        return res.status(200).json({ "message": "Registered successfully." });
    }

    // If user already exists, return an error response
    return res.status(400).json({ "message": "User already registered." });
});

// Login endpoint
app.post('/login', async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ "message": "User not registered." });
    }
    const token = jwt.sign({email}, JWT_SECRET, { expiresIn: '2h' });  
    res.cookie('token', token, {
        httpOnly: true, // Prevent JavaScript access
        secure: false, // Set to true in production
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    });
    console.log(res.cookie)
    return res.status(200).json({ "message": "Logged in." });
});

// Logout endpoint
app.post('/logout', (req, res) => {
    res.clearCookie('token',{
        httpOnly: true, // Prevent JavaScript access
        secure: false, // Set to true in production
        maxAge: 2 * 60 * 60 * 1000, // 2 hours
    }); // Clear the cookie
    res.status(200).json({ message: 'Logout successful' });
});

app.get('/watchlists', isLoggedIn, async (req, res) => {
    try {
      const user = await User.findOne({email:req.user.email})
      const watchlists = await Watchlist.find({ user: user._id }); // Fetch only for the user
      res.status(200).json(watchlists);
    } catch (error) {
      res.status(500).json({ message: 'Error fetching watchlists.' });
    }
  });

  app.get('/watchlist/:id', isLoggedIn, async (req, res) => {
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
});


app.post('/watchlists', isLoggedIn, async (req, res) => {
    console.log(req.user)
    const { name } = req.body;
    const user = await User.findOne({email:req.user.email}) // Assuming you're storing user id in the request after login

    try {
        const newWatchlist = new Watchlist({ name, user: user._id });
        await newWatchlist.save();
        await User.findByIdAndUpdate(user._id, { $push: { watchlists: newWatchlist._id } });

        res.status(201).json({ message: 'Watchlist created successfully', watchlist: newWatchlist });
    } catch (error) {
        res.status(500).json({ message: 'Failed to create watchlist', error: error.message });
    }
});

app.delete('/watchlist/:listId/movie/:imdbID', async (req, res) => {
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
  });

app.post('/watchlists/:listId', async (req, res) => {
    const { listId } = req.params;
    const {title,year,imdbID,type,poster } = req.body;
    console.log(req.body.Title)
    try {
      const watchlist = await Watchlist.findById(listId);
      watchlist.movies.push({ title: req.body.Title, year:req.body.Year, imdbID,poster:req.body.Poster });

      await watchlist.save();
      res.status(200).json({ message: 'Movie added to watchlist!' });
    } catch (error) {
      res.status(500).json({ message: 'Error adding movie to watchlist.' });
    }
  });


// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
