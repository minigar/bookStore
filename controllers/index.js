const express = require('express');

const auth = require('./auth');
const users = require('./users');
const karma = require('./karma');
const books = require('./books');

const router = express.Router();

router.use(users, karma, books)

module.exports = router