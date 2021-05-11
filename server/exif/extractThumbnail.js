const {ExifStructure} = require('./ExifStructure');

/**
 * Извлечь иконку из файла
 * Обычно иконки не превышают по объему 8 кб. Поэтому чтение должно происходить относительно быстро.
 * @param {FileHandle} fileHandle
 * @param {number} результат функции findExif. Позиция TIFF-заголовка блока EXIF
 * @returns {{buffer:Buffer, mime:string} | null}
 */
const extractThumbnail = async (fileHandle, basePosition) => {
    const result = await locateThumbnail(fileHandle, basePosition);
    if (result === null) {
        return null;
    }
    const buffer = Buffer.alloc(result.size);
    await fileHandle.read(buffer, 0, result.size, result.start);
    return {buffer, mime: result.mime};
};

/**
 * Найти положение иконки внутри файла, используя EXIF
 * @param {FileHandle} fileHandle 
 * @param {number} basePosition 
 * @returns {{start,size:number, mime:string} | null}
 */
const locateThumbnail = async (fileHandle, basePosition) => {
    if (basePosition === null) {
        return null;
    }
    const struct = await ExifStructure.create(fileHandle, basePosition);
    if (struct.ifd.length < 2) {
        // За иконку отвечает вторая запись IFD. И если ее нет, то иконки тоже нет
        return null;
    }
    const startRec = struct.ifd[1].find('JPEGInterchangeFormat');
    const sizeRec =  struct.ifd[1].find('JPEGInterchangeFormatLength');
    if (startRec === null || sizeRec === null) {
        return null;    // Нет иконки в формате JPEG
    }
    const start = await startRec.getValue() + basePosition;
    const size = await sizeRec.getValue();
    return {start, size, mime: 'image/jpeg'};
};

module.exports = {extractThumbnail, locateThumbnail};