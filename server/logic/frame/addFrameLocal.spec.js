const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {addFrameLocal} = require('./addFrameLocal');
const {makeNameFromId} = require('../makeNameFromId');
const {sqliteGet} = require('../../db/sqliteAsync');
const {getTestImageName} = require('../../utils/getTestImageName');

describe('addFrameLocal', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });

    it('jpeg', async () => {
        const testPath = path.join(commonPath, 'addFrameLocal_jpeg');
        await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        const srcFileName = getTestImageName('withExif.jpg');

        const res = await addFrameLocal(db, testPath, folderId, srcFileName, {title: 'My frame'});
        expect(res).to.have.property('frameId', 1);
        expect(res).to.have.property('fileId', 1);
        const expectedFileName = path.join(testPath, makeNameFromId(res.frameId), makeNameFromId(res.fileId)+'.jpg');
        expect(res).to.have.property('fileName', expectedFileName);

        const frame = await sqliteGet(db, 'SELECT * FROM frame WHERE id=?', [res.frameId]);
        expect(frame).to.have.property('title', 'My frame');
        expect(frame).to.have.property('role', 1);
        // Дата, взятая из EXIF
        expect(frame).to.have.property('dateTime');
        const dateTime = new Date(frame.dateTime);
        expect(dateTime.toISOString()).to.be.equal('2020-03-05T18:10:42.000Z');

        const file = await sqliteGet(db, 'SELECT * FROM file WHERE id=?', [res.fileId]);
        expect(file).to.have.property('ext', 'jpg');
    });
});