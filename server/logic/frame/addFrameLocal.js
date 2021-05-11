const fs = require('fs');
const path = require('path');
const {findExif} = require('../../exif/findExif');
const {ExifStructure} = require('../../exif/ExifStructure');
const {createFrame} = require('./createFrame');
const {createFile} = require('../file/createFile');
const {detectFormat} = require('../../formats/detectFormat');
const {getFolderPath} = require('../folder/getFolderPath');
const {makeNameFromId} = require('../makeNameFromId');
const {setMainFileForFrame} = require('./setMainFileForFrame');
const {exifDateTime} = require('../../exif/exifDateTime');

/**
 * Добавление типичного фрейма, который создается из файла, расположенного в файловой системе сервера.
 * Первая версия фотоменеджера ориентирована на такой режим, когда приложение работает на локальном хосте.
 * Поэтому такой способ наиболее эффективный.
 * @param {sqlite3.Database} db 
 * @param {string} basePath
 * @param {number} folderId 
 * @param {string} srcFileName 
 * @param {object?} options 
 * @param {string?} options.title
 * @returns {{frameId,fileId:number, fileName:string}} id созданного фрейма
 */
const addFrameLocal = async (db, basePath, folderId, srcFileName, options = {}) => {
    // 1. Получить информацию из исходного файла
    const frameInfo = {...options, role: 0};
    const fileHandle = await fs.promises.open(srcFileName, 'r');
    let ext = '';
    try {
        // Определить формат
        const fmt = await detectFormat(fileHandle);
        if (fmt.startsWith('image/')) {
            frameInfo.role = 1;
        }
        if (fmt === 'image/jpeg') {
            ext = 'jpg';
        }

        // загрузить EXIF
        const basePosition = await findExif(fileHandle);
        if (basePosition !== null) {
            const struct = await ExifStructure.create(fileHandle, basePosition);
            const ifd = struct.ifd[0];
            if (ifd) {
                // const exifIfd = ifd.find(0x8769); // Exif IFD Pointer
                const dtTag = ifd.find('DateTime');
                if (dtTag) {
                    const strDateTime = await dtTag.getValue();
                    if (strDateTime) {
                        const dt = exifDateTime(strDateTime);
                        frameInfo.dateTime = dt.getTime();
                    }
                }
            }
        }
    } finally {
        fileHandle.close();
    }
    // 2. Создать фрейм
    const frameId = await createFrame(db, folderId, frameInfo);
    // 3. Создать файл
    const fileId = await createFile(db, frameId, {ext});
    await setMainFileForFrame(db, frameId, fileId);
    // 4. Копировать файл
    const dstPath = await getFolderPath(db, folderId, basePath);
    if (!ext) {
        // Извлечь расширение из исходного файла
        const parts = path.parse(srcFileName);
        ext = parts.ext;
    }
    let name = makeNameFromId(fileId);
    if (ext) {
        name += '.' + ext;
    }
    const fileName = path.join(dstPath, name);
    await fs.promises.copyFile(srcFileName, fileName);
    return {frameId, fileId, fileName};
};

module.exports = {addFrameLocal};