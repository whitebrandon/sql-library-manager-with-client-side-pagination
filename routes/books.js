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
router.get('/pg/:id', handler.asyncHandler(async (req, res) => {
    let pageNum = Math.floor(parseInt(req.params.id));
    // ↓ Edge case that insures user can't enter a negative or float for page number 
    pageNum < 0 || req.params.id % 1 !== 0 ? res.redirect(`/books/pg/${-pageNum}`) : null;
    if (req.cookies.search_results) {
        const books = await handler.searchWithCookie(Book, req.cookies.search_results, pageNum);
        if (books.count < pageNum * 10 -10) res.render('page-not-found');
        if (books.count > 0) {
            res.render('index', {books: books.rows, fullResults: books.count, active: parseInt(pageNum), hasCookie: true, searchString: req.cookies.search_results})
        } else {
            res.render('no-results');
        }
    } else {
        const books = await Book.findAndCountAll({offset: (pageNum * 10) - 10 , limit: 10, order: [['createdAt','DESC']]});
        if (books.count > pageNum * 10 - 10) {
            res.render('index', {books: books.rows, fullResults: books.count, active: parseInt(pageNum)});
        } else {
            res.render('page-not-found');
        }
    }
}, Book));

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