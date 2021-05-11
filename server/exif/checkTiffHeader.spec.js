const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {checkTiffHeader} = require('./checkTiffHeader');

describe('checkTiffHeader', () => {
    it('main', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');

        const resOk = await checkTiffHeader(fileHandle, 0x0C);
        expect(resOk).is.have.property('isBigEndian', false);
        expect(resOk).is.have.property('startPosition', 0x14);

        const resFail = await checkTiffHeader(fileHandle, 0);
        expect(resFail).is.null;

        fileHandle.close();
    });
});