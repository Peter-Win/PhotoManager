const {sqliteRun} = require('../db/sqliteAsync');

const createFile = async (db, frameId, ext) => {
    const {lastID} = await sqliteRun(db, 'INSERT INTO file (frameId, ext) VALUES (?, ?)', [frameId, ext]);
    return lastID;
}

module.exports = {createFile};