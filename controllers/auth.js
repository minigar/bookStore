const bcrypt = require('bcryptjs'); // library for generate and compare password hash 
const jwt = require('jsonwebtoken'); //library for authentication 
const express = require('express')
const { v4: uuidv4 } = require('uuid');

const jwtMethods = require('../helpers/jwtMethods');
const User = require('../models/User');
const Token = require('../models/Token');
const config = require('../lib/config');

const router = express.Router();

const updateTokens = (userId) => {
    const accessToken = jwtMethods.generateAccessToken(userId);
    const refreshToken = jwtMethods.generateRefreshToken();

    return jwtMethods.replaceRefreshTokenInDb(refreshToken.id, userId)
        .then(() => ({
            accessToken,
            refreshToken: refreshToken.token,
        }));
};

router.post('/register', async(req, res) => {
    const { name, email, password } = req.body;
    const user = await User.findOne({ email })

    if (user) {
        res.status(400).json('This email aready exist')
    }

    if (password.length < 8) {
        res.status(400).json('Password must have 8 or more characters')
    }

    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    await new User({ email, name, password: hash }).save();
    res.status = 201;
    res.json(await User.find({ email }))
})

router.post('/login', async(req, res, next) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        res.status(401).json("Email not found")
    }

    // compare passwords (return boolean)
    const comparePassword = await bcrypt.compare(password, user.password);

    if (comparePassword) {
        updateTokens(user._id)
        .then(tokens => res.json(tokens))
    }
    
    else{
        res.status(401).json("Password incorrected")
    }
})

router.post('/refresh', async(req, res) => {
    // must return new access and refresh tokens
})

module.exports = router