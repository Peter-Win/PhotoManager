/**
 * Определить тип файла по его содержимому
 * @param {FileHandle} fileHandle 
 * @param {number} startPos 
 * @returns {string | null} MIME
 */
const detectFormat = async (fileHandle, startPos = 0) => {
    const buf = Buffer.alloc(8);
    // check JPEG
    await fileHandle.read(buf, 0, 8, startPos);
    if (testPattern(jfifSignature, buf)) {
        return 'image/jpeg';
    }
    // TIFF or CR2
    if (testPattern(tiffII, buf) || testPattern(tiffMM, buf)) {
        return 'image/tiff';
    }
    return null;
};

const testPattern = (pattern, buf, pos=0) => {
	const k = pattern.findIndex((value, i) => value !== buf[pos + i]);
	return k === -1;
}

const jfifSignature = [0xFF, 0xD8];
const tiffII = [0x49, 0x49, 0x2A, 0x00];
const tiffMM = [0x4D, 0x4D, 0x00, 0x2A];


module.exports = {detectFormat};