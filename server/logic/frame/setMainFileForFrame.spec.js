const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const sqlite3 = require('sqlite3').verbose();
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {createFrame} = require('./createFrame');
const {createFile} = require('../file/createFile');
const {sqliteGet} = require('../../db/sqliteAsync');
const {setMainFileForFrame} = require('./setMainFileForFrame');

const getMainFileId = async (db, frameId) => {
    const data = await sqliteGet(db, 'SELECT mainFileId FROM frame WHERE id=?', [frameId]);
    return data.mainFileId;
};

describe('setMainFileForFrame', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('main', async () => {
        const db = new sqlite3.Database(':memory:');
        const mediaPath = path.join(commonPath, 'setMainFileForFrame_main');
        await prepareEmptyFolder(mediaPath);
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, mediaPath);
        const frameId = await createFrame(db, folderId);
        const fileId1 = await createFile(db, frameId);
        expect(fileId1).to.be.equal(1);
        const fileId2 = await createFile(db, frameId);
        expect(fileId2).to.be.equal(2);
        expect(await getMainFileId(db, frameId)).to.be.null;

        await setMainFileForFrame(db, frameId, fileId1);
        expect(await getMainFileId(db, frameId)).to.be.equal(fileId1);

        await setMainFileForFrame(db, frameId, fileId2);
        expect(await getMainFileId(db, frameId)).to.be.equal(fileId2);
    });
});