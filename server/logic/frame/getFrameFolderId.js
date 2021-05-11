const {sqliteGet} = require('../../db/sqliteAsync');

const getFrameFolderId = async (db, frameId) => {
    const {folderId} = await sqliteGet(db, 'SELECT folderId FROM frame WHERE id=?', [frameId]);
    return folderId;
};

module.exports = {getFrameFolderId};