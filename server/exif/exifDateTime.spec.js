const {expect} = require('chai');
const {exifDateTime} = require('./exifDateTime');

describe('exifDateTime', () => {
    it('main', () => {
        const d = exifDateTime('2020:02:22 01:34:35');
        expect(d.toISOString()).to.be.equal('2020-02-22T01:34:35.000Z');
    });
});