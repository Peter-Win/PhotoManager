const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {makeObjectPath} = require('./makeObjectPath');
const {prepareEmptyFolder} = require('../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../utils/createTable');
const {createFolder} = require('./folder/createFolder');
const {createFrame} = require('./frame/createFrame');
const {createFile} = require('./file/createFile');

describe('makeObjectPath', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('fileRoot', async () => {
        const testPath = path.join(commonPath, 'makeObjectPath_fileRoot');
        await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId1, fullFolderName: path1} = await createFolder(db, 0, testPath);
        expect(folderId1).to.be.equal(1);
        const {id: folderId2, fullFolderName: path2} = await createFolder(db, folderId1, path1);
        expect(folderId2).to.be.equal(2);
        const frameId = await createFrame(db, folderId2);
        const fileId = await createFile(db, frameId);
        const pathF = await makeObjectPath({db, id: fileId, basePath: testPath, pathType: 'fileRoot'});
        expect(pathF).to.be.equal(path2);
    });
});