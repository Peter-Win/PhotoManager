const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {sqliteRun} = require('../../db/sqliteAsync');
const {makeNameFromId} = require('../makeNameFromId');
const {makeInsert} = require('../../db/makeInsert');

/**
 * Создать новую папку
 * @param {sqlite3.Database} db 
 * @param {number} ownerId     0 для создания папки верхнего уровня
 * @param {string} parentFolder Полный путь к media-папке владельца
 * @param {object?} options
 * @returns {{id: number, fullFolderName: string}}
 */
const createFolder = async (db, ownerId, parentFolder, options) => {
    const {sql, values} = makeInsert('folder', {...options, ownerId});
    const res = await sqliteRun(db, sql, values);
    const id = res.lastID;
    const localFolderName = makeNameFromId(id);
    const fullFolderName = path.join(parentFolder, localFolderName);
    await fs.promises.mkdir(fullFolderName);
    return {id, fullFolderName};
}

module.exports = { createFolder };