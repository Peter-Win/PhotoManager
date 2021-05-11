const {sqliteRun} = require('../../db/sqliteAsync');
const {makeInsert} = require('../../db/makeInsert');

const createFile = async (db, frameId, options = {}) => {
    const {sql, values} = makeInsert('file', {frameId, ...options});
    const {lastID} = await sqliteRun(db, sql, values);
    return lastID;
}

module.exports = {createFile};