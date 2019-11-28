const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* READs full list of books. */
router.get('/', async (req, res) => {
  const books = await Book.findAll();
  res.render('index', {books: books.map(book => book = book.dataValues)});
});

/* READs the "create a new book" form. */
router.get('/new', (req, res) => {
  res.render('new-book');
});

/* CREATEs a new book and adds it to the database */
router.post('/new', async (req, res) => {
  await Book.create(req.body);
  res.redirect('/books')
});

/* READs the "book detail" form */
router.get('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    // console.log("This is what's in book: ", book);
    res.render('update-book', {book: book.dataValues});
  } catch (error) {
    console.error(error)
  }
});

/* UPDATEs book info and saves it to the database */
router.post('/:id', (req, res) => {
  res.redirect('/books')
});

/* DELETEs a book */
router.post('/:id/delete', (req, res) => {
  res.redirect('/books')
});

module.exports = router;
