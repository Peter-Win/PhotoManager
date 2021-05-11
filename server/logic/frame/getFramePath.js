const {getFrameFolderId} = require('./getFrameFolderId');
const {getFolderPath} = require('../folder/getFolderPath');

const getFramePath = async (db, frameId, rootPath) => {
    const folderId = await getFrameFolderId(db, frameId);
    const folderPath = await getFolderPath(db, folderId, rootPath);
    return folderPath;
};

module.exports = {getFramePath};