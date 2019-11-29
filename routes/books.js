const express = require('express');
const router = express.Router();
const { Book } = require('../models');

/* READs full list of books. */
router.get('/', async (req, res) => {
  try {
    const books = await Book.findAll();
    res.render('index', {books: books.map(book => book = book.dataValues)});
  } catch (error) {
    console.error(error);
  }
});

/* READs the "create a new book" form. */
router.get('/new', (req, res) => {
  try {
    res.render('new-book');
  } catch (error) {
    console.error(error);
  }
});

/* CREATEs a new book and adds it to the database */
router.post('/new', async (req, res) => {
  try {
    await Book.create(req.body);
    res.redirect('/books')
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // do something here
    }
    console.error(error);
  }
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
router.post('/:id', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    await Book.update(req.body, {where: { id: book.id}});
    res.redirect('/books')
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      // do something here
    }
    console.error(error);
  }
});

/* DELETEs a book */
router.post('/:id/delete', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    await Book.destroy({where: {id: book.id}});
    res.redirect('/books')
  } catch (error) {
    console.error(error);
  }
});

module.exports = router;
