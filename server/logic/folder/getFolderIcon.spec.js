const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {createTestEnvironment} = require('../../utils/createTestEnvironment');
const {addFrameLocal} = require('../frame/addFrameLocal');
const {getTestImageName} = require('../../utils/getTestImageName');
const {getFolderIcon} = require('./getFolderIcon');
const {getFrameIcon} = require('../frame/getFrameIcon');
const {makeNameFromId} = require('../makeNameFromId');
const {setMainFrameForFolder} = require('./setMainFrameForFolder');

describe('getFolderIcon', () => {
    it('use first frame icon', async () => {
        const envDef = {addFiles: ['withExif.jpg', 'icon.jpg']};
        const env = await createTestEnvironment(__dirname, 'getFolderIcon_use1fr', envDef);
        const {db, rootPath, folderId, frames} = env;

        // frame icon
        const frIcon = await getFrameIcon(db, frames[0].frameId, rootPath);
        expect(frIcon).to.have.not.property('notFound');
        expect(frIcon).to.have.property('mime', 'image/jpeg');
        expect(frIcon).to.have.property('data');

        // folder icon
        const icon = await getFolderIcon(db, folderId, rootPath);
        expect(icon).to.have.not.property('notFound');
        expect(icon).to.have.property('mime', 'image/jpeg');
        expect(icon).to.have.property('data');
        expect(icon.data.readUInt16BE()).to.be.equal(0xFFD8);
        expect(icon.data).to.be.eql(frIcon.data);
    });
    it('use second frame icon', async () => {
        const envDef = {addFiles: ['withExif.jpg', 'noExif.jpg']};
        const env = await createTestEnvironment(__dirname, 'getFolderIcon_use2fr', envDef);
        const {db, rootPath, folderId, frames} = env;

        const {frameId, fileId, fileName} = frames[1];
        const iconName = path.join(path.dirname(fileName), makeNameFromId(fileId)+'i.jpg');
        await fs.promises.copyFile(getTestImageName('icon.jpg'), iconName);
        await setMainFrameForFolder(db, folderId, frameId);

        // // folder icon
        const icon = await getFolderIcon(db, folderId, rootPath);
        expect(icon).to.have.not.property('notFound');
        expect(icon).to.have.property('mime', 'image/jpeg');
        expect(icon).to.have.property('name', iconName);
    });
});