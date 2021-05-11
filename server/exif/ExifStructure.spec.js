const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {ExifStructure} = require('./ExifStructure');

describe('ExifStructure', () => {
    it('main', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');
        const struc = await ExifStructure.create(fileHandle, 0x0C);
        expect(struc.ifd).is.have.lengthOf(2);

        const exifPointer = struc.ifd[0].find(0x8769);
        expect(exifPointer).is.not.null;
        fileHandle.close();
    });
});