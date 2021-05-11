const {sqliteAll} = require('../../db/sqliteAsync');
/**
 * Получить содержимое папки для последующего отображения
 * @param {sqlite3.Database} db
 * @param {number} folderId
 * @return {{frames: Array<{id:number, title, date: string}>}}
 */
const getFolderContent = async (db, folderId) => {
	const frames = await sqliteAll(db, "SELECT id, title FROM frame WHERE folderId=?", [folderId]);
	const folders = await sqliteAll(db, 'SELECT id, title FROM folder WHERE ownerId=?', [folderId]);
	return {frames, folders};
};

module.exports = {getFolderContent};