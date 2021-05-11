const {getFileIcon:getFileIconLogic} = require('../logic/file/getFileIcon');
const {getFolderIcon:getFolderIconLogic} = require('../logic/folder/getFolderIcon');
const {getFrameIcon:getFrameIconLogic} = require('../logic/frame/getFrameIcon');

const sendIcon = (iconInfo, response) => {
    response.append('content-type', iconInfo.mime);
    if (iconInfo.data) {
        response.send(iconInfo.data);
    } else {
        response.sendFile(iconInfo.name);
    }
}

const getFrameIcon = async (request, response, ctx) => {
    const {id} = request.params;
    const iconInfo = await getFrameIconLogic(ctx.db, id, ctx.mediaPath);
    sendIcon(iconInfo, response);
}

const getFileIcon = async (request, response, ctx) => {
    const {id} = request.params;
    const iconInfo = await getFileIconLogic(ctx.db, id, ctx.mediaPath, 'fileRoot');
    sendIcon(iconInfo, response);
}

const getFolderIcon = async (request, response, ctx) => {
    const {id} = request.params;
    const iconInfo = await getFolderIconLogic(ctx.db, id, ctx.mediaPath);
    sendIcon(iconInfo, response);
}

module.exports = {getFileIcon, getFrameIcon, getFolderIcon};