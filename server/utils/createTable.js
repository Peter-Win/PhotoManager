const {sqliteRun, createTableOperator} = require('../db/sqliteAsync');
const {schemeFolder, schemeFrame, schemesList} = require('../db/schemes');

const createFolderTable = async (db) => {
    return sqliteRun(db, createTableOperator(schemeFolder));
};

const createFrameTable = async (db) => {
    return sqliteRun(db, createTableOperator(schemeFrame));
};

const createTables = async (db, tableNames) => {
    const namesSet = new Set(tableNames);
    return Promise.all(schemesList
        .filter(tblDef => namesSet.has(tblDef.name))
        .map(tblDef => sqliteRun(db, createTableOperator(tblDef)))
    );
};

module.exports = {createFolderTable, createFrameTable, createTables};