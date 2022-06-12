const express = require('express');
const passport = require('passport');
require('../lib/passport-config')(passport)

const router = express.Router();

const User = require('../models/User');
const Book = require('../models/Book');

router.get('/books', async(req, res) => {
    const books = await Book.find();

    res.status(200).json(books)
})

router.post('/books', passport.authenticate('jwt', { session: false}), async(req, res) => {
    const { name, description, cost } = req.body;

    const book = await Book.findOne({ name })

    if (book) {
        res.json("This name already exist")
    }
    else{
        const user = req.user
        const ownersBook = await Book.findOne({ name })
        user.books.unshift(ownersBook)
        await new Book({ name, description, author:user.name, cost}).save();
        res.status(200).json(await Book.findOne({ name }));
    }
})

router.get('/books', async(req, res) => {
    const book = await Book.find();

    res.status(200).json(book)
})


module.exports = router