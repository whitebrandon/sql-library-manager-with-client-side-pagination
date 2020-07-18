/******************************************
SQL Library Manager
Name: Brandon White
Date of Last Modification: 17/07/2020
******************************************/

const express = require('express');
const router = express.Router();

/* Redirects to /books, which is the homepage */
router.get('/', (req, res) => {
  res.redirect('/books');
});

module.exports = router;
