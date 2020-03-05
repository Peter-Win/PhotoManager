const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../utils/createTable');
const {createFolder} = require('./createFolder');
const {createFrame} = require('./createFrame');
const {getFolderContent} = require('./getFolderContent');

describe('getFolderContent', () => {
	const commonPath = path.join(__dirname, 'test');
	beforeAll(() => {
		if (!fs.existsSync(commonPath)) {
			fs.mkdirSync(commonPath);
		}
	});
	it('main', async () => {
		const testPath = path.join(commonPath, 'getFolderContentMain');
		await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        expect(folderId).to.be.equal(1);
        const frameId1 = await createFrame(db, folderId, {role: 1, title: 'First'});
        const frameId2 = await createFrame(db, folderId, {role: 2, title: 'Second'});
        const res = await getFolderContent(db, folderId);
        expect(res).to.have.property('frames');
        expect(res.frames).to.have.lengthOf(2);
        expect(res.frames[0]).to.have.property('title', 'First');
        expect(res.frames[1]).to.have.property('title', 'Second');
	});
});