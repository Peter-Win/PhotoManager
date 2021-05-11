const path = require('path');
const fs = require('fs');
const {sqliteGet} = require('../../db/sqliteAsync');
const {getFolderPath} = require('./getFolderPath');
const {getFrameIcon} = require('../frame/getFrameIcon');

/**
 * Получить иконку папки
 * @param {sqlite3.Database} db 
 * @param {number} folderId 
 * @param {string} rootPath 
 * @returns {{notFound?: boolean; mime: string; name?: string; data?: string|ByteArray}}
 */
const getFolderIcon = async (db, folderId, rootPath) => {
    const folderPath = await getFolderPath(db, folderId, rootPath);

    // Если в папке есть файл icon.jpg
    const folderIconName = path.join(folderPath, 'icon.jpg');
    try {
        const isExists = await fs.promises.access(folderIconName, fs.constants.F_OK);
        if (isExists) {
            return {name: folderIconName, mime: 'image/jpeg'};
        }
    } catch (e) {
    }

    // Поискать mainFrameId
    let {mainFrameId} = await sqliteGet(db, 'SELECT mainFrameId FROM folder WHERE id=?', [folderId]);
    if (!mainFrameId) {
        // Если это поле не заполнено, берем первый фрейм
        const {id} = await sqliteGet(db, 'SELECT id FROM frame WHERE folderId=?', [folderId]);
        if (id) {
            mainFrameId = id;
        }
    }
    if (mainFrameId) {
        const icon = await getFrameIcon(db, mainFrameId, rootPath);
        return icon;
    }
    return {notFound: true}; // TODO: нужна дефолтная иконка
};

module.exports = {getFolderIcon};