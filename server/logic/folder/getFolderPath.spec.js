const {expect} = require('chai');
const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const {createFolder} = require('./createFolder');
const {createFolderTable} = require('../../utils/createTable');
const {getFolderPath} = require('./getFolderPath');

describe('getFolderPath', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('main', async () => {
        const rootPath = path.join(commonPath, 'getFolderPathMain');
        await prepareEmptyFolder(rootPath);
        const db = new sqlite3.Database(':memory:');
        await createFolderTable(db);
        const {id: folderId1, fullFolderName: path1} = await createFolder(db, 0, rootPath);
        const {id: folderId2, fullFolderName: path2} = await createFolder(db, folderId1, path1);

        const newPath2 = await getFolderPath(db, folderId2, rootPath);
        expect(newPath2).to.be.equal(path2);
    });
});