const {expect} = require('chai');
const {getDrives} = require('./getDrives');

describe('getDrives', () => {
    it('main case', async () => {
        const drives = await getDrives();
        // Результат может быть разный, но это массив строк
        expect(Array.isArray(drives)).to.be.true;
        expect(drives.length).to.be.greaterThan(0);
    });
});
