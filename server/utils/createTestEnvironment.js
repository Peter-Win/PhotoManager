const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const {createTables} = require('./createTable');
const {createFolder} = require('../logic/folder/createFolder');
const {addFrameLocal} = require('../logic/frame/addFrameLocal');
const {getTestImageName} = require('./getTestImageName');
const {prepareEmptyFolder} = require('./prepareEmptyFolder');

/**
 * 
 * @param {string} dirName
 * @param {string} rootShort 
 * @param {object?} options 
 * @param {string?} options.title Title of main frame
 * @param {string?} options.addImage
 * @param {Array<string|{name,title:string}>?} options.addFiles
 * @returns {{
 *   db:sqlite3.Database;
 *   rootPath:string;
 *   folderId:number;
 *   fullFolderName:string;
 *   frameId?: number;
 *   fileId?: number;
 *   fileName?: string;
 *   {frameId, fileId:string; fileName:string}[]?: frames;
 * }}
 */
const createTestEnvironment = async (dirName, rootShort, options = {}) => {
    const db = new sqlite3.Database(':memory:');
    const rootPath = path.join(dirName, 'test', rootShort);
    await prepareEmptyFolder(rootPath);
    return createEnvironment(db, rootPath, options);
};

const createEnvironment = async (db, rootPath, options = {}) => {
    await createTables(db, ['folder', 'frame', 'file']);

    const result = {rootPath, db};

    const mainOptions = {};
    if (options.title) {
        mainOptions.title = options.title;
    }
    const {id: folderId, fullFolderName} = await createFolder(db, 0, rootPath, mainOptions);
    result.folderId = folderId;
    result.fullFolderName = fullFolderName;

    const makeImageName = name => name.indexOf(path.sep) >= 0 ? name : getTestImageName(name);

    const addFrame = async (info) => {
        let imageName =  '';
        let options = {};
        if (typeof info === 'object') {
            imageName = makeImageName(info.name);
            options.title = info.title;
        } else if (typeof info === 'string') {
            imageName = makeImageName(info);
        }
        options.title = options.title || path.basename(imageName);
        return addFrameLocal(db, rootPath, folderId, imageName, options);
    }
    
    if (options.addImage) {
        const frame = await addFrame(options.addImage);
        Object.assign(result, frame); // {frameId, fileId, fileName}
    } else if (options.addFiles) {
        result.frames = [];
        for (const currentFileName of options.addFiles) {
            const frame = await addFrame(currentFileName);
            result.frames.push(frame);
        }
    }
    return result;
};

module.exports = {createTestEnvironment, createEnvironment};