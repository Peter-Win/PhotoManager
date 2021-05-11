const path = require('path');
const fs = require('fs');
const {expect} = require('chai');

const {IfdBlock} = require('./IfdBlock');

describe('IfdBlock', () => {
    it('main', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');
        const basePos = 0x0C;
        const isBigEndian = false;

        const block = new IfdBlock(fileHandle, basePos, isBigEndian)
        await block.load(0x14);
        expect(block.record).to.have.lengthOf(10);
        expect(block.record[0].getTagName()).to.be.equal('Make');
        expect(await block.record[0].getValue()).to.be.equal('Canon');

        expect(block.nextPos).to.be.equal(0x404);

        fileHandle.close();
    });
});