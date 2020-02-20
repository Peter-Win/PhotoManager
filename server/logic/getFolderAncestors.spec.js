const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {expect} = require('chai');

const {sqliteRun, createTableOperator} = require('../db/sqliteAsync');
const {getFolderAncestors} = require('./getFolderAncestors');
const {createFolder} = require('./createFolder');
const {prepareEmptyFolder} = require('../utils/prepareEmptyFolder');
const {createFolderTable} = require('../utils/createTable');

describe('getFolderAncestors', () => {
    const commonTestFolder = path.join(__dirname, 'test')
    beforeAll(() => {
        if (!fs.existsSync(commonTestFolder)) {
            fs.mkdirSync(commonTestFolder);
        }
    });

    it('main', async () => {
        const folderPath = path.join(commonTestFolder, 'getFolderAncestorsMain');
        await prepareEmptyFolder(folderPath);
        const db = new sqlite3.Database(':memory:');
        await createFolderTable(db);

        const {id: id1, fullFolderName: path1} = await createFolder(db, 0, folderPath);
        const {id: id2} = await createFolder(db, id1, path1);

        const list1 = await getFolderAncestors(db, id1);
        expect(list1).to.be.deep.equal([1]);

        const list2 = await getFolderAncestors(db, id2);
        expect(list2).to.be.deep.equal([1, 2]);
    });
});