const path = require('path');
const {sqliteGet} = require('../../db/sqliteAsync');
const {makeObjectPath} = require('../makeObjectPath');
const {makeNameFromId} = require('../makeNameFromId');

/**
 * 
 * @param {sqlite3.Database} db 
 * @param {number} fileId 
 * @param {string} basePath 
 * @param {string} pathType 
 */
const getFileName = async (db, fileId, basePath, pathType) => {
    const fileDir = await makeObjectPath({db, id: fileId, basePath, pathType});
    const rec = await sqliteGet(db, 'SELECT ext FROM file WHERE id=?', [fileId]);
    return path.join(fileDir, makeNameFromId(fileId) + '.' + rec.ext);
};

module.exports = {getFileName};