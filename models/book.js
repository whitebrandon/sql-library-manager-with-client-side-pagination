'use strict';

const Sequelize = require('sequelize');

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
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Title"',
                },
                notEmpty: {
                    msg: 'Please provide a value for "Title"',
                },
            }
        },
        author: {
            type: Sequelize.STRING,
            allowNull: false,
            validate: {
                notNull: {
                    msg: 'Please provide a value for "Author"'
                },
                notEmpty: {
                    msg: 'Please provide a value for "Author"'
                },
            },
        },
        genre: {
            type: Sequelize.STRING,
        },
        year: {
            type: Sequelize.INTEGER(4),
            allowNull: true,
            validate: {
                isNumeric: {
                    msg: 'Please only provide numeric characters as a value for "Year"'
                }
            }
        },
    }, { sequelize })

    return Book;
}