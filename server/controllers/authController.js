const User = require('../models/userModel')
const JWT_SECRET = 'your_jwt_secret_key';
const jwt = require('jsonwebtoken');


exports.signup = async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
        console.log(email)

        await User.create({ 
            email,
            watchlists: []
         });
        return res.status(200).json({ "message": "Registered successfully." });
    }
    return res.status(400).json({ "message": "User already registered." });
}

exports.login = async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(400).json({ "message": "User not registered." });
    }
    const token = jwt.sign({email}, JWT_SECRET, { expiresIn: '2h' });  
    res.cookie('token', token, {
        httpOnly: true, 
        secure: false, 
        maxAge: 2*60*60*1000,
    });
    console.log(res.cookie)
    return res.status(200).json({ "message": "Logged in." });
}

exports.logout = (req, res) => {
    res.clearCookie('token',{
        httpOnly: true,
        secure: false,
        maxAge: 2*60*60*1000,
    }); 
    res.status(200).json({ message: 'Logout successful' });
}

