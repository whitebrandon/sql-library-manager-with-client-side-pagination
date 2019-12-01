const Sequelize = require('sequelize');
const { Op } = Sequelize

module.exports = {
    
    /**
     * Handler for try...catch 
     * @param {Function} callback - the function that runs query and redirects/renders page
     * @param {Object} model - the model instance
     */
    asyncHandler: (callback, model) => {
        return async (req, res, next) => {
            try {
                await callback(req, res, next);
            } catch (error) {
                if (error.name === "SequelizeValidationError") {
                    res.render('form-error', { error: error.errors, book: await model['findByPk'](req.params.id)})
                } else {
                    res.status(500).send(error);
                    console.error(error);
                }
            }
        }
    },

    /**
     * Uses a 'search_result(s)' cookie to search database
     * @param {Object} model - the Model instance
     * @param {String} query - the search string to compare against the Model
     * @param {Integer} pageNumber - the number of the page corresponding with results 
     */
    searchWithCookie: (model, query, pageNumber) => {
        const attributes = ['title', 'author', 'genre', 'year'];
        const argument = attributes.map(attribute => ({[attribute]: {[Op.like]: `%${query}%`}}));
        return (
            model['findAndCountAll']({
                where: {[Op.or]: argument},
                offset: pageNumber ? (pageNumber * 10) - 10 : null, 
                limit: pageNumber ? 10 : null,
            })
        );
    },
}