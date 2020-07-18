/******************************************
SQL Library Manager
Name: Brandon White
Date of Last Modification: 17/07/2020
******************************************/

// Modules
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const indexRouter = require('./routes/index');
const booksRouter = require('./routes/books');

// Express instance
const app = express();

// View Engine setup
app.set('view engine', 'pug');

app.use(express.json());
app.use(cookieParser()); // ← Parses cookie header
app.use(express.urlencoded({ extended: false })); // ← Parses incoming reqs w/ urlencoded payloads
app.use(express.static('public')); // ← For static files

// Routes
app.use('/', indexRouter);
app.use('/books', booksRouter);

// Catches 404 and forwards to error handler
app.use((req, res, next) => {
  next(createError(404));
});

// Error handler
app.use((err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.statusCode === 404 ? res.render('page-not-found') : res.render('error');
});

module.exports = app;