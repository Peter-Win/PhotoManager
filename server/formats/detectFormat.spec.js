const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const {detectFormat} = require('./detectFormat');

describe('detectFormat', () => {
    const imgPath = path.normalize(path.join(__dirname, '..', 'testImg'));

    it('jpeg', async () => {
        const fileName = path.join(imgPath, 'withExif.jpg');
        const h = await fs.promises.open(fileName, 'r');
        const res = await detectFormat(h);
        h.close();
        expect(res).to.be.equal('image/jpeg');
    });

    it('tiff', async () => {
        const fileName = path.join(imgPath, 'icon.tiff');
        const h = await fs.promises.open(fileName, 'r');
        const res = await detectFormat(h);
        h.close();
        expect(res).to.be.equal('image/tiff');
    });
});