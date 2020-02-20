const {expect} = require('chai');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {prepareEmptyFolder} = require('../utils/prepareEmptyFolder');
const {createFolderTable, createFrameTable} = require('../utils/createTable');
const {createFolder} = require('./createFolder');
const {createFrame} = require('./createFrame');
const {sqliteGet} = require('../db/sqliteAsync');

describe('createFrame', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('main', async () => {
        const testPath = path.join(commonPath, 'createFrameMain');
        await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createFolderTable(db);
        await createFrameTable(db);
        const {id: folderId, fullFolderName: folderPath} = await createFolder(db, 0, testPath);

        const frameId1 = await createFrame(db, folderId, 2);
        expect(frameId1).to.be.equal(1);

        const frameId2 = await createFrame(db, folderId, 1);
        expect(frameId2).to.be.equal(2);
        const record = await sqliteGet(db, "SELECT * FROM frame WHERE id=?", [frameId2]);
        expect(record).to.have.property('id', frameId2);
        expect(record).to.have.property('folderId', 1);
        expect(record).to.have.property('role', 1);

        const record1 = await sqliteGet(db, "SELECT * FROM frame WHERE id=?", [frameId1]);
        expect(record1).to.have.property('role', 2);
    });
});