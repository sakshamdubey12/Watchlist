const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const isLoggedIn = require('./middleware/isLoggedIn')
require('./utils/db');

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

app.use('/',require('./routes/authRoutes'))
app.use('/watchlists',isLoggedIn,require('./routes/watchlistRoutes'))

// Start the server
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
