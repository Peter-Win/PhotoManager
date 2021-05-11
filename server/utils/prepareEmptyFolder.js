const fs = require('fs');
const path = require('path');

const recursiveClear = async (folderName) => {
    const dir = await fs.promises.opendir(folderName);
    for await (const dirent of dir) {
        const fullPath = path.join(folderName, dirent.name);
        if (dirent.isFile()) {
            await fs.promises.unlink(fullPath);
        } else if (dirent.isDirectory()) {
            await recursiveClear(fullPath);
            await fs.promises.rmdir(fullPath);
        }
    }
};

const checkExists = async (dirPath) => {
    try {
        await fs.promises.access(dirPath, fs.constants.F_OK);
    } catch (errAccess) {
        // Папка не существует. Надо создать.
        await checkExists(path.dirname(dirPath));
        await fs.promises.mkdir(dirPath);
        return false;
    }
    return true;
}

/**
 * Подготовить пустую папку
 * Если она не существует, то создается
 * Если есть содержимое, оно стирается
 * @param {string} fullFolderName Полный путь
 */
const prepareEmptyFolder = async (fullFolderName) => {
    const bExists = await checkExists(fullFolderName);
    if (bExists) {
        // Папка существует. Надо убрать содержимое
        await recursiveClear(fullFolderName);
    }
};

module.exports = {prepareEmptyFolder};
