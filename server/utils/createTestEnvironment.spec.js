const path = require('path');
const {expect} = require('chai');
const {createTestEnvironment} = require('./createTestEnvironment');
const {makeNameFromId} = require('../logic/makeNameFromId');

describe('createTestEnvironment', () => {
    it('single file', async () => {
        const {
            db, folderId, fullFolderName, frameId, fileId, fileName
        } = await createTestEnvironment(__dirname, 'createTestEnvironment_single', {
            addImage: 'withExif.jpg'
        });
        expect(folderId).to.be.equal(1);
        expect(frameId).to.be.equal(1);
        expect(fileId).to.be.equal(1);
        expect(fileName).to.be.equal(path.join(fullFolderName, makeNameFromId(fileId)+'.jpg'));
    });
    it('multiple files', async () => {
        const {db, frames} = await createTestEnvironment(__dirname, 'createTestEnvironment_multi', {
            addFiles: ['withExif.jpg', 'icon.jpg'],
        });
        expect(frames).to.have.lengthOf(2);

        expect(frames[0]).to.have.property('frameId', 1);
        expect(frames[0]).to.have.property('fileId', 1);

        expect(frames[1]).to.have.property('frameId', 2);
        expect(frames[1]).to.have.property('fileId', 2);
    });
});