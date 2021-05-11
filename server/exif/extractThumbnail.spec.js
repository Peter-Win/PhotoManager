const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {findExif} = require('./findExif');
const {extractThumbnail} = require('./extractThumbnail');

describe('extractThumbnail', () => {
    it('jpeg', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');
        const basePosition = await findExif(fileHandle);
        expect(basePosition).to.be.equal(0x0C);
        const info = await extractThumbnail(fileHandle, basePosition);
        expect(info).to.have.property('buffer');
        expect(info).to.have.property('mime', 'image/jpeg');
        const {buffer} = info;
        expect(buffer.readUInt16BE()).to.be.equal(0xFFD8); // Начало JPEG-файла
        fileHandle.close();
    });

    it('null basePosition', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'icon.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');
        const basePosition = await findExif(fileHandle);
        expect(basePosition).to.be.null;
        const info = await extractThumbnail(fileHandle, basePosition);
        expect(info).to.be.null;
        fileHandle.close();
    })
});