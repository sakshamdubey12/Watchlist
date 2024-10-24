// middleware/isLoggedIn.js
const jwt = require('jsonwebtoken');

const JWT_SECRET = 'your_jwt_secret_key'; // Make sure this is consistent with your server setup

const isLoggedIn = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ message: 'Forbidden: Invalid token' });
        }
        req.user = user; // Attach user info to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = isLoggedIn;
