const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const sqlite3 = require('sqlite3').verbose();
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {addFrameLocal} = require('./addFrameLocal');
const {getTestImageName} = require('../../utils/getTestImageName');
const {makeNameFromId} = require('../makeNameFromId');

const {getFrameIcon} = require('./getFrameIcon');

describe('getFrameIcon', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });
    it('mainFileId', async () => {
        const db = new sqlite3.Database(':memory:');
        const testPath = path.join(commonPath, 'getFrameIcon_mainFileId');
        await prepareEmptyFolder(testPath);
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        const srcFileName = getTestImageName('withExif.jpg');
        const frameInfo = await addFrameLocal(db, testPath, folderId, srcFileName);
        expect(frameInfo).to.have.property('frameId', 1);
        expect(frameInfo).to.have.property('fileId', 1);

        const result = await getFrameIcon(db, frameInfo.frameId, testPath);
        expect(result).to.have.not.property('notFound');
        expect(result).to.have.property('mime', 'image/jpeg');
        expect(result).to.have.property('data');
    });
});