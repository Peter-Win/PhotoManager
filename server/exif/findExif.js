const fs = require('fs');

/**
 * @param {FileHandle} fileHandle Описатель файла, полученный из openFile
 * @param {number} position
 * @return {number|null} Позиция начала блока EXIF в файле. Или null, если не найдено.
 */
const findExif = async (fileHandle, position = 0) => {
	// Попытка определить JFIF-формат
	const buffer = Buffer.alloc(2);
	await fileHandle.read(buffer, 0, 2, position);
	if (buffer.equals(jfifSignature)) {
		return findExifInJFIF(fileHandle, position);
	}
	return null;
};
const jfifSignature = Buffer.from([0xFF, 0xD8]);

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
			const buf2 = Buffer.alloc(4);
			await fileHandle.read(buf2, 0, 4, curPos + 2);
			if (buf2.equals(exifPrefix)) {
				return curPos + 2;
			}
		}
		curPos += len;
	}
};
const exifPrefix = Buffer.from([0x45, 0x78, 0x69, 0x66]);

module.exports = {findExif};