const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {createTestEnvironment} = require('../../utils/createTestEnvironment');
const {createFolder} = require('../folder/createFolder');
const {createFrame} = require('../frame/createFrame');
const {getFolderContent} = require('../folder/getFolderContent');

describe('getFolderContent', () => {
	it('main', async () => {
        const envDef = {
            title: 'Main folder',
            addFiles: [
                {name: 'withExif.jpg', title: 'First frame'}, 
                {name: 'town.jpg', title: 'Second frame'},
            ],
        };
        const {db, folderId, fullFolderName} =
            await createTestEnvironment(__dirname, 'getFolderContentMain', envDef);
        // subfolder
        await createFolder(db, folderId, fullFolderName, {title: 'Subfolder 1'});
        await createFolder(db, folderId, fullFolderName, {title: 'Subfolder 2'});
        await createFolder(db, folderId, fullFolderName, {title: 'Subfolder 3'});

        const res = await getFolderContent(db, folderId);

        expect(res).to.have.property('frames');
        expect(res.frames).to.have.lengthOf(2);
        expect(res.frames[0]).to.have.property('id', 1);
        expect(res.frames[0]).to.have.property('title', 'First frame');
        expect(res.frames[1]).to.have.property('id', 2);
        expect(res.frames[1]).to.have.property('title', 'Second frame');

        expect(res).to.have.property('folders');
        expect(res.folders).to.have.lengthOf(3);
        expect(res.folders[0]).to.have.property('id', 2);
        expect(res.folders[0]).to.have.property('title', 'Subfolder 1');

        const res0 = await getFolderContent(db, 0);
        expect(res0.frames).to.have.lengthOf(0);
        expect(res0.folders).to.have.lengthOf(1);
        expect(res0.folders[0]).to.have.property('id', 1);
        expect(res0.folders[0]).to.have.property('title', 'Main folder');
	});
});