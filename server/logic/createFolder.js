const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {sqliteRun} = require('../db/sqliteAsync');
const {makeNameFromId} = require('./makeNameFromId');

/**
 * Создать новую папку
 * @param {sqlite3.Database} db 
 * @param {number} ownerId     0 для создания папки верхнего уровня
 * @param {string} parentFolder Полный путь к media-папке владельца
 * @returns {{id: number, fullFolderName: string}}
 */
const createFolder = async (db, ownerId, parentFolder) => {
    const res = await sqliteRun(db, 'INSERT INTO folder (ownerId) VALUES (?)', [ownerId]);
    const id = res.lastID;
    const localFolderName = makeNameFromId(id);
    const fullFolderName = path.join(parentFolder, localFolderName);
    await fs.promises.mkdir(fullFolderName);
    return {id, fullFolderName};
}

module.exports = { createFolder };