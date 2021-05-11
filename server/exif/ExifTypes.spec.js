const {expect} = require('chai');
const {ExifTypes, ExifTypeCodes} = require('./ExifTypes');

describe('ExifTypes', () => {
    it('BYTE', () => {
        const buf = Buffer.from([1, -1]);
        expect(ExifTypes.BYTE.read(buf, 0, true)).to.be.equal(1);
        expect(ExifTypes.BYTE.read(buf, 0, false)).to.be.equal(1);
        expect(ExifTypes.BYTE.read(buf, 1, true)).to.be.equal(255);
        expect(ExifTypes.BYTE.read(buf, 1, false)).to.be.equal(255);
    });
    it('SHORT', () => {
        const buf = Buffer.from([0, 1, -1, -2]);
        expect(ExifTypes.SHORT.read(buf, 0, true)).to.be.equal(1);
        expect(ExifTypes.SHORT.read(buf, 0, false)).to.be.equal(0x100);
        expect(ExifTypes.SHORT.read(buf, 2, true)).to.be.equal(0xFFFE);
        expect(ExifTypes.SHORT.read(buf, 2, false)).to.be.equal(0xFEFF);
    });
    it('LONG', () => {
        const buf = Buffer.from([0, 1, 2, 3, -1, -2, -3, -4]);
        expect(ExifTypes.LONG.read(buf, 0, true)).to.be.equal(0x00010203);
        expect(ExifTypes.LONG.read(buf, 0, false)).to.be.equal(0x03020100);
        expect(ExifTypes.LONG.read(buf, 4, true)).to.be.equal(0xFFFEFDFC);
        expect(ExifTypes.LONG.read(buf, 4, false)).to.be.equal(0xFCFDFEFF);
    });
    it('RATIONAL', () => {
        const buf = Buffer.from([0, 0, 0, 1, 0, 0, 0, 2,   0, 0, 0, 0, 0, 0, 0, 0]);
        expect(ExifTypes.RATIONAL.read(buf, 0, true)).to.be.equal(0.5);
        expect(ExifTypes.RATIONAL.read(buf, 0, false)).to.be.equal(0.5);
        expect(ExifTypes.RATIONAL.read(buf, 8, true)).to.be.equal(0);
        expect(ExifTypes.RATIONAL.read(buf, 8, false)).to.be.equal(0);
    });
    it('SLONG', () => {
        const buf = Buffer.alloc(8);
        buf.writeInt32BE(-123, 0);
        buf.writeInt32LE(-123, 4);
        expect(ExifTypes.SLONG.read(buf, 0, true)).to.be.equal(-123);
        expect(ExifTypes.SLONG.read(buf, 4, false)).to.be.equal(-123);
        buf.writeInt32BE(1, 0);
        expect(ExifTypes.SLONG.read(buf, 0, true)).to.be.equal(1);
        expect(ExifTypes.SLONG.read(buf, 0, false)).to.be.equal(0x01000000);
    });
    it('SRATIONAL', () => {
        const buf = Buffer.alloc(16);
        buf.writeInt32BE(1, 0);
        buf.writeInt32BE(4, 4);
        expect(ExifTypes.SRATIONAL.read(buf, 0, true)).to.be.equal(0.25);
        buf.writeInt32LE(1, 8);
        buf.writeInt32LE(2, 12);
        expect(ExifTypes.SRATIONAL.read(buf, 8, false)).to.be.equal(0.5);
        buf.writeInt32BE(-1, 0);
        buf.writeInt32BE(4, 4);
        expect(ExifTypes.SRATIONAL.read(buf, 0, true)).to.be.equal(-0.25);
        buf.writeInt32LE(-1, 8);
        buf.writeInt32LE(2, 12);
        expect(ExifTypes.SRATIONAL.read(buf, 8, false)).to.be.equal(-0.5);
    });
    it('ExifTypeCodes', () => {
        expect(ExifTypeCodes[1].name).to.be.equal('BYTE');
        expect(ExifTypeCodes[2].name).to.be.equal('ASCII');
        expect(ExifTypeCodes[3].name).to.be.equal('SHORT');
        expect(ExifTypeCodes[4].name).to.be.equal('LONG');
        expect(ExifTypeCodes[5].name).to.be.equal('RATIONAL');
        expect(ExifTypeCodes[7].name).to.be.equal('UNDEFINED');
        expect(ExifTypeCodes[9].name).to.be.equal('SLONG');
        expect(ExifTypeCodes[10].name).to.be.equal('SRATIONAL');
    });
});