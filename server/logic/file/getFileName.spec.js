
const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {createFrame} = require('../frame/createFrame');
const {createFile} = require('./createFile');

const {getFileName} = require('./getFileName');

describe('getFileName', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('main', async () => {
        const testPath = path.join(commonPath, 'getFileName_Main');
        await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        const frameId = await createFrame(db, folderId, {});
        const fileId = await createFile(db, frameId, {ext: 'txt'});

        const fileName = await getFileName(db, fileId, fullFolderName, 'basePath');
        expect(fileName).is.equal(path.join(testPath, '000001', '000001.txt'));
    });
});