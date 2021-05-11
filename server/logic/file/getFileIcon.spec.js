const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('../../utils/createTable');
const {createFolder} = require('../folder/createFolder');
const {createFrame} = require('../frame/createFrame');
const {createFile} = require('./createFile');
const {makeNameFromId} = require('../makeNameFromId');
const {getFileIcon} = require('./getFileIcon');
const {getFileName} = require('./getFileName');
const {getTestImageName} = require('../../utils/getTestImageName');

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
    
    it('extract icon from file with EXIF', async () => {
        const testPath = path.join(commonPath, 'getFileIconExif');
        await prepareEmptyFolder(testPath);
        // Создать БД и таблицы
        const db = new sqlite3.Database(':memory:');
        await createTables(db, ['folder', 'frame', 'file']);
        // Создать необходимые сущности
        const {id: folderId, fullFolderName} = await createFolder(db, 0, testPath);
        const frameId = await createFrame(db, folderId, {role: 1, title: 'My image'});
        const fileId = await createFile(db, frameId, {ext: 'jpg'});
        // Скопировать файл
        const srcFileName = getTestImageName('withExif.jpg');
        const fileName = path.join(fullFolderName, makeNameFromId(fileId) + '.jpg');
        fs.copyFileSync(srcFileName, fileName);
        // Извлечь иконку из файла
        const iconInfo = await getFileIcon(db, fileId, fullFolderName, 'fileFolder');
        expect(iconInfo).to.have.property('mime', 'image/jpeg');
        expect(iconInfo).to.have.property('data');
        const {data} = iconInfo;
        expect(data).to.be.instanceof(Buffer);
        expect(data.readUInt16BE()).to.be.equal(0xFFD8); // Первые два байта JPEG
        // Записать, чтобы можно было открыть файл и посмотреть
        const dstFileName = path.join(fullFolderName, 'icon.jpg');
        fs.writeFileSync(dstFileName, data);
    });
});