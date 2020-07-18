/******************************************
Treehouse Techdegree:
FSJS project 8 - SQL Library Manager
Name: Brandon White
Date of Last Modification: 03/12/2019
******************************************/

const express = require('express');
const router = express.Router();
const { Book } = require('../models');
const handler = require('../server-scripts');

/* Clears cookie and redirects */
router.get('/', handler.asyncHandler(async (req, res) => {
    res.clearCookie('search_results')
    res.redirect('/books/pg/1')
}, Book));

/* DECLAREs cookie and sets it to value of search string */
router.post('/', handler.asyncHandler(async (req, res) => {
    res.cookie('search_results', req.body.search);
    res.redirect('/books/pg/1')
}, Book));

/* READs full list of books with/without cookies */
router.get('/pg/:id', async (req, res, next) => {
    let pageNum = Math.floor(parseInt(req.params.id));
    pageNum < 0 || req.params.id % 1 !== 0 ? res.redirect(`/books/pg/${-pageNum}`) : null;
    const books = await Book.findAll({order: [['createdAt', 'DESC']]});
    pageNum > Math.ceil(books.length/10) ? res.render('page-not-found') : res.render('index', { books });
});

/* READs the "create a new book" form. */
router.get('/new', handler.asyncHandler(async (req, res) => {
    res.render('new-book');
}, Book));

/* CREATEs a new book and adds it to the database */
router.post('/new', handler.asyncHandler(async (req, res) => {
    for (let fields of Object.keys(req.body)) {
        req.body[fields] === "" ? req.body[fields] = null : req.body[fields] = req.body[fields];
    }
    await Book.create(req.body);
    res.redirect('/books')
}, Book));

/* READs the "book detail" form */
router.get('/:id', handler.asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    book ? res.render('update-book', {book: book.dataValues}) : res.render('no-results');
}, Book));

/* UPDATEs book info and saves it to the database */
router.post('/:id', handler.asyncHandler(async (req, res) => {
    for (let fields of Object.keys(req.body)) {
        req.body[fields] === "" ? req.body[fields] = null : req.body[fields] = req.body[fields];
    }
    const book = await Book.findByPk(req.params.id);
    await Book.update(req.body, {where: { id: book.id}});
    res.redirect('/books')
}, Book));

/* Prepares a book for deletion */
router.get('/:id/delete', handler.asyncHandler(async (req, res) => {
    let book = await Book.findByPk(req.params.id);
    if (book) {
        book = book.dataValues
        res.render('delete-confirm', {book})
    } else {
        res.render('page-not-found');
    }
}, Book));

/* DELETEs a book */
router.post('/:id/confirm', handler.asyncHandler(async (req, res) => {
    const book = await Book.findByPk(req.params.id);
    if (book) {
        await Book.destroy({where: {id: book.id}});
        res.redirect('/books');
    } else {
        res.render('page-not-found');
    }
}, Book));

module.exports = router;