const path = require('path');
const {getFolderAncestors} = require('./getFolderAncestors');
const {makeNameFromId} = require('../makeNameFromId');

/**
 * 
 * @param {sqlite3.Database} db 
 * @param {number} folderId ИД папки
 * @param {string} rootPath Полный путь к папке верхнего уровня
 * @returns {string} Полный путь к медия-папке
 */
const getFolderPath = async (db, folderId, rootPath) => {
    const ids = await getFolderAncestors(db, folderId);
    return ids.reduce((currentPath, id) => path.join(currentPath, makeNameFromId(id)), rootPath);
};

module.exports = {getFolderPath};