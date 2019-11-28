'use strict';

const Sequelize = require('sequelize');
// const moment = require('moment');

module.exports = (sequelize) => {
    class Book extends Sequelize.Model {};
    Book.init({
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        title: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER,
        },
    }, { sequelize })

    return Book;
}