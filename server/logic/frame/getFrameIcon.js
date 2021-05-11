const path = require('path');
const {getFramePath} = require('./getFramePath');
const {makeNameFromId} = require('../makeNameFromId');
const {sqliteGet} = require('../../db/sqliteAsync');
const {getFileIcon} = require('../file/getFileIcon');

/**
 * Получить иконку файла
 * @param {sqlite3.Database} db 
 * @param {number} frameId 
 * @param {string} rootPath
 * @returns {{name?: string, data?:string|ByteArray, mime:string, notFound?: boolean}} 
 */
const getFrameIcon = async (db, frameId, rootPath) => {
    const framePath = await getFramePath(db, frameId, rootPath);
	const strName = makeNameFromId(frameId);
    // Поискать файл с суффиксом fr
	const iconName = path.join(framePath, `${strName}fr.jpg`);
	try {
		await fs.promises.access(iconName, fs.constants.F_OK);
		return {name: iconName, mime: 'image/jpeg'};
	} catch (e) {}
    // Попытаться найти главный файл фрейма
    const {mainFileId} = await sqliteGet(db, 'SELECT mainFileId FROM frame WHERE id=?', [frameId]);
    const fileIcon = await getFileIcon(db, mainFileId, framePath, 'basePath');
    if (fileIcon.notFound) {
        // Если не найдена файловая иконка, то выдать стандартную иконку для фрейма
        return {notFound: true};
    }
    return fileIcon;
};

module.exports = {getFrameIcon};