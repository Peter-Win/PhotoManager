const {sqliteRun, createTableOperator} = require('../db/sqliteAsync');
const {schemeFolder, schemeFrame} = require('../db/schemes');

const createFolderTable = async (db) => {
    return sqliteRun(db, createTableOperator(schemeFolder));
};

const createFrameTable = async (db) => {
    return sqliteRun(db, createTableOperator(schemeFrame));
}

module.exports = {createFolderTable, createFrameTable};