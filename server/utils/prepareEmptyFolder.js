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

/**
 * Подготовить пустую папку
 * Если она не существует, то создается
 * Если есть содержимое, оно стирается
 * @param {string} fullFolderName Полный путь
 */
const prepareEmptyFolder = async (fullFolderName) => {
    try {
        await fs.promises.access(fullFolderName, fs.constants.F_OK);
    } catch (errAccess) {
        // Папка не существует. Надо создать.
        await fs.promises.mkdir(fullFolderName);
        return;
    }
    // Папка существует. Надо убрать содержимое
    await recursiveClear(fullFolderName);
};

module.exports = {prepareEmptyFolder};
