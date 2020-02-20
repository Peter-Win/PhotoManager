class PostFolder {
    /**
     * 
     * @param {http.ClientRequest} request 
     * @param {http.ServerResponse} response 
     */
    exec(request, response) {
        console.log('CreateFolder');
        console.log('> request: ', JSON.stringify(request));
        response.end();
    }
};

module.exports = {CreateFolder};
