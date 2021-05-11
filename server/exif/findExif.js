const fs = require('fs');
const {detectFormat} = require('../formats/detectFormat');

/**
 * @param {FileHandle} fileHandle Описатель файла, полученный из openFile
 * @param {number} position
 * @return {number|null} Позиция начала блока EXIF в файле. Или null, если не найдено.
 * 		Блок начинается с TIFF-заголовка. И соответствует базовой позиции.
 */
const findExif = async (fileHandle, position = 0) => {
	const fmt = await detectFormat(fileHandle, position);
	// JFIF
	if (fmt === 'image/jpeg') {
		return findExifInJFIF(fileHandle, position);
	}
	// TIFF or CR2
	if (fmt === 'image/tiff') {
		return position;
	}
	return null;
};

const findExifInJFIF = async (fileHandle, position) => {
	const buffer = Buffer.alloc(4);
	let curPos = position;
	for (;;) {
		await fileHandle.read(buffer, 0, 2, curPos);
		curPos += 2;
		if (buffer[0] !== 0xFF) {
			return null;
		}
		if (buffer[1] === 0xD8) {
			continue;
		}
		await fileHandle.read(buffer, 2, 2, curPos);
		const len = buffer.readInt16BE(2);
		if (buffer[1] === 0xE1) {
			// Возможно, этот чанк содержит Exif
			const n = exifPrefix.length;
			const buf2 = Buffer.alloc(n);
			await fileHandle.read(buf2, 0, n, curPos + 2);
			if (buf2.equals(exifPrefix)) {
				return curPos + 2 + exifPrefix.length;
			}
		}
		curPos += len;
	}
};
const exifPrefix = Buffer.from([0x45, 0x78, 0x69, 0x66, 0, 0]);

module.exports = {findExif};