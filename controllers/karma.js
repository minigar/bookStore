const express = require('express');
const { route } = require('./auth');
const passport= require('passport');

const router = express.Router();

// router.post('/karma/:id',  passport.authenticate('local', { failureRedirect: '/like', failureMessage: true }), async(req, res) => {
    
// })

router.delete('/karma/:id', async(req, res) => {

})


module.exports = router