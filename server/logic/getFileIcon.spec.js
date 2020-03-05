const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../utils/createTable');
const {createFolder} = require('./createFolder');
const {createFrame} = require('./createFrame');
const {createFile} = require('./createFile');
const {makeNameFromId} = require('./makeNameFromId');
const {getFileIcon} = require('./getFileIcon');

const imageData = 'Hello';

describe('getFileIcon', () => {
	const commonPath = path.join(__dirname, 'test');
	beforeAll(() => {
		if (!fs.existsSync(commonPath)) {
			fs.mkdirSync(commonPath);
		}
	});

	it('with icon file', async () => {
		const testPath = path.join(commonPath, 'getFileIconI');
		await prepareEmptyFolder(testPath);
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        const frameId = await createFrame(db, folderId, {role: 1, title: 'My image'});
        const fileId = await createFile(db, frameId, {ext: 'jpg'});
        const strName = makeNameFromId(fileId);
        const iconName = path.join(fullFolderName, strName + 'i.jpg');
        fs.writeFileSync(iconName, imageData);
        const iconInfo = await getFileIcon(db, fileId, fullFolderName, 'fileFolder');
        expect(iconInfo).to.have.property('name', iconName);
	});
});