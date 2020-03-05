const path = require('path');
const fs = require('fs');
const {makeObjectPath} = require('./makeObjectPath');
const {makeNameFromId} = require('./makeNameFromId');

/**
 * Получить иконку файла. Имя файла или содержимое.
 * @return {{name?:string, data?:string|ByteArray, mime: string}}
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
	return {name: 'Not Found'};
};

module.exports = {getFileIcon};