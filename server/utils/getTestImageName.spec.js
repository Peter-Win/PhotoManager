const fs = require('fs');
const {expect} = require('chai');
const {getTestImageName} = require('./getTestImageName');

describe('getTestImageName', () => {
    it('withExif.jpg', () => {
        const fullName = getTestImageName('withExif.jpg');
        const isFound = fs.existsSync(fullName);
        expect(isFound).to.be.true;
    });
});