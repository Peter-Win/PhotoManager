const fs = require('fs');
const path = require('path');
const {expect} = require('chai');
const {findExif} = require('./findExif');

describe('findExif', () => {
	it('with Exif', async () => {
		const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
		const fileHandle = await fs.promises.open(fileName, 'r');
		try {
			const exifPos = await findExif(fileHandle);
			const buf = Buffer.alloc(4);
			await fileHandle.read(buf, 0, 4, exifPos);
			expect(buf.toString()).to.be.equal('Exif');
		} finally {
			fileHandle.close();
		}
	});
	it('jpeg without Exif', async () => {
		const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'icon.jpg'));
		const fileHandle = await fs.promises.open(fileName, 'r');
		try {
			const exifPos = await findExif(fileHandle);
			expect(exifPos).to.be.null;
		} finally {
			fileHandle.close();
		}		
	});
});