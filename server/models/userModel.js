const mongoose = require('mongoose');

// Define the user schema
const userSchema = new mongoose.Schema({
    email: { type: String, required: true },
    watchlists: { type: [mongoose.Schema.Types.ObjectId], 
        ref: 'Watchlist', 
        default: [],
    } 
});

// Create the User model
const User = mongoose.model('User', userSchema);

module.exports = User;
