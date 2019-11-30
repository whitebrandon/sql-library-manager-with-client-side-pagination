const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const Sequelize = require('sequelize');
const { Op } = Sequelize

/* READs full list of books. */
router.get('/', async (req, res) => {
  res.redirect('/books/pg/1')
});

router.post('/', async (req, res) => {
  const books = await Book.findAll({
    where: {
      [Op.or]: [
        {
          title: {
            [Op.like]: `%${req.body.search}%`,
          }
        }, 
        {
          author: {
            [Op.like]: `%${req.body.search}%`,
          }
        }, 
        {
          genre: {
            [Op.like]: `%${req.body.search}%`,
          }
        }, 
        {
          year: {
            [Op.like]: `%${req.body.search}%`,
          }
        }]
    }
  })
  res.render('index2', {books: books.map(book => book = book)});
})

router.get('/pg/:id', async (req, res) => {
  console.log(req.body);
  const length = await Book.findAll()
  const books = await Book.findAll({offset: (req.params.id * 10) - 10 , limit: 10})
  res.render('index', {books: books.map(book => book = book), length: length.length, active: parseInt(req.params.id)});
})

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
router.get('/:id/delete', async (req, res) => {
  try {
    let book = await Book.findByPk(req.params.id);
    book = book.dataValues
    // await Book.destroy({where: {id: book.id}});
    res.render('delete-confirm', {book})
  } catch (error) {
    console.error(error);
  }
});

router.post('/:id/confirm', async (req, res) => {
  try {
    const book = await Book.findByPk(req.params.id);
    await Book.destroy({where: {id: book.id}});
    res.redirect('/books');
  } catch (error) {
    console.error("Oops, there was an error: ", error);
  }
});

module.exports = router;
