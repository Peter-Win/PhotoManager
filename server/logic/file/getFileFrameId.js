const {sqliteGet} = require('../../db/sqliteAsync');

/**
 * Получить id фрейма для указанного файла
 * @param {sqlite3.Database} db 
 * @param {number} fileId 
 * @returns {number}
 */
const getFileFrameId = async (db, fileId) => {
    const {frameId} = await sqliteGet(db, 'SELECT frameId FROM file WHERE id=?', [fileId]);
    return frameId;
};

module.exports = {getFileFrameId};