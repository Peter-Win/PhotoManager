const {sqliteRun} = require('../db/sqliteAsync');

/**
 * Фрейм. Объект, соответствующий одной фотографии, но который может включать несколько изображений.
 * @param {sqlite3.Database} db 
 * @param {number} folderId Идентификатор папки, которой будет принадлежать создаваемый фрейм
 * @param {number} role 1=image, 2=video
 * @returns {number} Идентификатор зоданного фрейма
 */
const createFrame = async (db, folderId, role) => {
    const {lastID: frameId} = await sqliteRun(db, 'INSERT INTO frame (folderId, role) VALUES (?, ?)',
        [folderId, role]);
    return frameId;
};

module.exports = {createFrame};