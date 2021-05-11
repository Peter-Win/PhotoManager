const {ExifTypes} = require('./ExifTypes');

/**
 * 
 * @param {FileHandle} fileHandle 
 * @param {number} basePosition 
 * @returns {{isBigEndian: boolean, startPosition: number} | null}
 */
const checkTiffHeader = async (fileHandle, basePosition) => {
    const buf = Buffer.alloc(8);
    const result = {};
    // read TIFF header
    await fileHandle.read(buf, 0, 8, basePosition);
    // check a byte order
    if (buf[0] === 0x49 && buf[1] === 0x49) {
        result.isBigEndian = false;
    } else if (buf[0] === 0x4D && buf[1] === 0x4D) {
        result.isBigEndian = true;
    } else {
        return null;
    }

    // check 002A value
    const testValue = ExifTypes.SHORT.read(buf, 2, result.isBigEndian);
    if (testValue !== 0x002A) {
        return null;
    }

    result.startPosition = basePosition + ExifTypes.LONG.read(buf, 4, result.isBigEndian);
    return result;
}

module.exports = {checkTiffHeader};