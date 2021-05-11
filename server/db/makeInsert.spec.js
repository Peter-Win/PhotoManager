const {expect} = require('chai');
const {makeInsert} = require('./makeInsert');

describe('makeInsert', () => {
    it('main', () => {
        const {sql, values} = makeInsert('person', {name: 'John', age:33});
        expect(sql).to.be.equal('INSERT INTO person (name, age) VALUES (?, ?)');
        expect(values).to.be.eql(['John', 33]);
    });
});