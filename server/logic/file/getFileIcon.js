const path = require('path');
const fs = require('fs');
const {makeObjectPath} = require('../makeObjectPath');
const {makeNameFromId} = require('../makeNameFromId');
const {findExif} = require('../../exif/findExif');
const {extractThumbnail} = require('../../exif/extractThumbnail');
const {getFileName} = require('./getFileName');

/**
 * Получить иконку файла. Имя файла или содержимое.
 * @return {{name?:string, data?:string|ByteArray, mime: string, notFound?: boolean}}
 */
const getFileIcon = async (db, fileId, basePath, pathType) => {
	const fileDir = await makeObjectPath({db, id: fileId, basePath, pathType});
	// самый простой вариант - наличие файла иконки с суффиксом i
	const strName = makeNameFromId(fileId);
	const iconName = path.join(fileDir, `${strName}i.jpg`);
	try {
		await fs.promises.access(iconName, fs.constants.F_OK);
		return {name: iconName, mime: 'image/jpeg'};
	} catch (e) {}

	// Попытка поискать Exif
	const fileName = await getFileName(db, fileId, fileDir, 'basePath');
	const fileHandle = await fs.promises.open(fileName, 'r');
	try {
		const exifPos = await findExif(fileHandle);
		const info = await extractThumbnail(fileHandle, exifPos);
		if (info !== null) {
			// Загружена иконка
			return {data: info.buffer, mime: info.mime};
		}
	} finally {
		fileHandle.close();
	}
	
	return {notFound: true};
};

module.exports = {getFileIcon};