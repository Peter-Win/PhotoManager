const fs = require('fs');
const path = require('path');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {sqliteGet} = require('../../db/sqliteAsync');
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {createFrame} = require('../frame/createFrame');
const {createFile} = require('./createFile');

describe('createFile', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('main', async () => {
        const testPath = path.join(commonPath, 'createFileMain');
        await prepareEmptyFolder(testPath);
        db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        const {folderId, fullFolderPath} = await createFolder(db, 0, testPath);
        const frameId = await createFrame(db, folderId);

        const fileId = await createFile(db, frameId, {ext: 'jpg'});
        expect(fileId).to.be.equal(1);
        const res = await sqliteGet(db, 'SELECT * FROM file WHERE id=?', [fileId]);
        expect(res).to.have.property('frameId', 1);
        expect(res).to.have.property('ext', 'jpg');

        const res1 = await sqliteGet(db, 'SELECT * FROM file WHERE id=?', [-1]);
        expect(res1).to.be.undefined;

        const fileId2 = await createFile(db, frameId, null);
        const res2 = await sqliteGet(db, 'SELECT * FROM file WHERE id=?', [fileId2]);
        expect(res2).to.have.property('ext', null);        
    });
});                     