const {sqliteGet} = require('../db/sqliteAsync');
/**
 * Получить список всех владельцев папки.
 * @param {sqlite3.Database} db
 * @param {number} folderId Идентификатор папки
 * @returns {number[]} Первым в списке всегда будет папка верхнего уровня. Последним - папка с указанным folderId
 */
const getFolderAncestors = async (db, folderId) => {
    const result = [];
    let id = folderId;
    for (;;) {
        result.unshift(id);
        const {ownerId} = await sqliteGet(db, "SELECT ownerId FROM folder WHERE id=?", [id]);
        if (ownerId === 0) {
            break;
        }
        id = ownerId;
    }
    return result;
};

module.exports = {getFolderAncestors};