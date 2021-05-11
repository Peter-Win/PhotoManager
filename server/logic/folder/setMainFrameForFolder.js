const {sqliteRun} = require('../../db/sqliteAsync');

/**
 * Назначить главный фрейм для папки
 * @param {sqlite3.Database} db 
 * @param {number} folderId 
 * @param {number|null} frameId 
 */
const setMainFrameForFolder = async (db, folderId, frameId) => {
    await sqliteRun(db, 'UPDATE folder SET mainFrameId=? WHERE id=?', [frameId, folderId]);
};

module.exports = {setMainFrameForFolder};