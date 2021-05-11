const {errorHandler} = require('./errorHandler');

const requestHandler = async (func, request, response, context) => {
    try {
        await func(request, response, context);
    } catch (e) {
        errorHandler(response, e);
    }
};

module.exports = {requestHandler};