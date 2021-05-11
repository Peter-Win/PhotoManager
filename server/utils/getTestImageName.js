const path = require('path');

const getTestImageName = (shortName) => {
    const chunks = __dirname.split(path.sep);
    const serverPos = chunks.findIndex(name => name === 'server');
    const serverPath = chunks.slice(0, serverPos + 1).join(path.sep);
    return path.join(serverPath, 'testImg', shortName);
};

module.exports = {getTestImageName};