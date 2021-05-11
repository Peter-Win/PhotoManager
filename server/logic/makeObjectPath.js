const {getFileFrameId} = require('./file/getFileFrameId');
const {getFrameFolderId} = require('./frame/getFrameFolderId');
const {getFolderPath} = require('./folder/getFolderPath');

/**
 * @param {Object} params
 * @param {sqlite3.Database?} params.db
 * @param {number} params.id
 * @param {string} params.basePath
 * @param {string} params.pathType = fileRoot | fileFrame | basePath
 * 	- basePath = использовать значение поля basePath без изменения
 *  - fileRoot = указана корневая media-папка, а объект - файл
 */
const makeObjectPath = async (params) => {
	if (params.pathType === 'fileRoot') {
		// id - указывает файл, basePath - корневая папка media
		const frameId = await getFileFrameId(params.db, params.id);
		const folderId = await getFrameFolderId(params.db, frameId);
		return await getFolderPath(params.db, folderId, params.basePath);
	}
	return params.basePath;
};

module.exports = {makeObjectPath};