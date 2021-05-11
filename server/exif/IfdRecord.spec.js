const fs = require('fs');
const path = require('path');
const {expect} = require('chai');

const {IfdRecord} = require('./IfdRecord');
const {Tags} = require('./Tags');

describe('IfdRecord', () => {
    it('main', async () => {
        const fileName = path.normalize(path.join(__dirname, '..', 'testImg', 'withExif.jpg'));
        const fileHandle = await fs.promises.open(fileName, 'r');
        const basePos = 0x0C; // Start pos of EXIF
        const isBigEndian = false;

        // ASCII string
        // Offset = 0x16. Tag Make = "Canon"
        const ifd1 = await IfdRecord.create(fileHandle, 0x16, basePos, isBigEndian);
        expect(ifd1).to.be.instanceof(IfdRecord);
        expect(ifd1.getTagName()).to.be.equal('Make');
        expect(ifd1.getType()).to.have.property('name', 'ASCII');
        expect(ifd1.isExternalData()).to.be.true;
        expect(ifd1.getExternalOffset()).to.be.equal(0x92);
        const v1 = await ifd1.getValue();
        expect(v1).to.be.equal('Canon');

        // Single number
        // Offset = 0x2E, Orientation:SHORT=1
        const ifd2 = await IfdRecord.create(fileHandle, 0x2E, basePos, isBigEndian);
        expect(ifd2.getTagName()).to.be.equal('Orientation');
        expect(ifd2.getType()).to.have.property('name', 'SHORT');
        expect(ifd2.isExternalData()).to.be.false;
        expect(ifd2.count).to.be.equal(1);
        expect(ifd2.getLength()).to.be.equal(2);
        expect(await ifd2.getValue()).to.be.equal(1);

        // Rational value with external data
        // Offset = 0x3A, XResolution: RATIONAL = 72
        const ifd3 = await IfdRecord.create(fileHandle, 0x3A, basePos, isBigEndian);
        expect(ifd3.getTagName()).to.be.equal('XResolution');
        expect(ifd3.getType()).to.have.property('name', 'RATIONAL');
        expect(ifd3.getLength()).to.be.equal(8);
        expect(ifd3.isExternalData()).to.be.true;
        expect(ifd3.getExternalOffset()).to.be.equal(0xA6);
        expect(await ifd3.getValue()).to.be.equal(72);

        const buf = Buffer.alloc(IfdRecord.length * 10);
        await fileHandle.read(buf, 0, buf.length, 0x16);
        const ifd11 = IfdRecord.createFromBuffer(buf, 0, fileHandle, basePos, isBigEndian);
        expect(await ifd11.getValue()).to.be.equal('Canon');
        const ifd21 = IfdRecord.createFromBuffer(buf, IfdRecord.length, fileHandle, basePos, isBigEndian);
        expect(await ifd21.getValue()).to.be.equal('Canon EOS 20D');


        // // Эксперимент
        // const showIfdList = async (ifdStartPos) => {
        //     const buf1 = Buffer.alloc(4);
        //     await fileHandle.read(buf1, 0, 2, ifdStartPos);
        //     const itemsCount = buf1.readUInt16LE(0);
    
        //     console.log('itemsCount=', itemsCount);
        //     for (let i = 0; i < itemsCount; i++) {
        //         const pos = ifdStartPos + 2 + i * IfdRecord.length;
        //         const ifd = await IfdRecord.create(fileHandle, pos, basePos, isBigEndian);
        //         expect(ifd).to.be.instanceof(IfdRecord);
        //         const type = ifd.getType();
        //         const typeName = type ? type.name : ifd.typeId;
        //         const value = await ifd.getValue();
        //         console.log(pos.toString(16).toUpperCase(), ifd.getTagName(), typeName, 'x', ifd.count, '>', JSON.stringify(value));            
        //     }
        // };
        // await showIfdList(0x14);
        // await showIfdList(0x108);
        // await showIfdList(0x3D6);
    });
});