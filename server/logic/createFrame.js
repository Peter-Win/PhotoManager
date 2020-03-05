const {sqliteRun} = require('../db/sqliteAsync');

/**
 * Фрейм. Объект, соответствующий одной фотографии, но который может включать несколько изображений.
 * @param {sqlite3.Database} db 
 * @param {number} folderId Идентификатор папки, которой будет принадлежать создаваемый фрейм
 * @param {Object} data
 * @param {number?} data.role 0=unknown (default), 1=image, 2=video
 * @returns {number} Идентификатор зоданного фрейма
 */ 
const createFrame = async (db, folderId, data={}) => {
	const fields = ['folderId', ...Object.keys(data)];
	const values = [folderId, ...Object.values(data)];
	const sql = `INSERT INTO frame (${fields.join(', ')}) VALUES (${fields.map(s => '?').join(', ')})`;
    const {lastID: frameId} = await sqliteRun(db, sql, values);
    return frameId;
};

module.exports = {createFrame};