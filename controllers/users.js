const express = require('express');
const passport = require('passport');
require('../lib/passport-config')(passport)

const User = require('../models/User');

const router = express.Router();



router.get('/users', passport.authenticate('jwt', { session: false}), async(req, res) => {
    const users = await User.find()

    console.log(req.user._id)

    res.status(200).json(users)
})


router.get('/authors', async(req, res) => {
})

module.exports = router