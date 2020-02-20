const {expect} = require('chai');
const {makeNameFromId} = require('./makeNameFromId');

describe('makeNameFromId', () => {
    it('main', () => {
        expect(makeNameFromId(123)).to.be.equal('000123');
    });
});
