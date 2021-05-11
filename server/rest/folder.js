const {createFolder} = require('../logic/folder/createFolder');
const {getFolderContent} = require('../logic/folder/getFolderContent');

/**
 * POST folder
 * Запрос на создание папки.
 * Входной параметр: ownerId - идентификатор папки-владельца
 * Результат: {id}
 * @param {Request} request 
 * @param {Response} response 
 * @param {{db: sqlite3.Database, mediaPath: string}} ctx 
 */
const postFolder = async (request, response, ctx) => {
    const ownerId = request.param('ownerId') || 0;
    const {id} = await createFolder(ctx.db, ownerId)
    response.json({id});
};

/**
 * GET folder/:id
 * Получить содержимое папки
 * @param {Request} request 
 * @param {Response} response 
 * @param {{db: sqlite3.Database; mediaPath: string}} ctx 
 */
const getFolder = async (request, response, ctx) => {
    response.json(await getFolderContent(ctx.db, request.params.id));
};

module.exports = {postFolder, getFolder};