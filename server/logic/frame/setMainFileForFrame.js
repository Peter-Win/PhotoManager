const {sqliteRun} = require('../../db/sqliteAsync');
/**
 * 
 * @param {sqlite3.Database} db 
 * @param {number} frameId 
 * @param {number} fileId
 */
const setMainFileForFrame = async (db, frameId, fileId) => {
    const sql = 'UPDATE frame SET mainFileId=? WHERE id=?';
    await sqliteRun(db, sql, [fileId, frameId]);
};

module.exports = {setMainFileForFrame};