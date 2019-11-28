const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* READs full list of books. */
router.get('/', (req, res) => {
  res.render('index');
});

/* READs the "create a new book" form. */
router.get('/new', (req, res) => {
  res.render('new-book');
});

/* CREATEs a new book and adds it to the database */
router.post('/new', (req, res) => {
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
