/**
 * Стандартный обработчик ошибок запроса
 * @param {Response} response 
 * @param {Error} error 
 */
const errorHandler = (response, error) => {
    response.status(500).json({error: error.message});
};

module.exports = {errorHandler};