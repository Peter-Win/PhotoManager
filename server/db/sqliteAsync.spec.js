const sqlite3 = require('sqlite3').verbose();
const {sqliteRun, sqliteAll, sqliteGet, createTableOperator, makeFieldSql, sqliteEscape} = require('./sqliteAsync');
const {expect} = require('chai');

describe('sqliteAsync', () => {
    it('createTableOperator', () => {
        const sql = createTableOperator({
            name: 'my_table',
            fields: [
                {name: 'first_name', type: 'text'},
                {name: 'age', type: 'integer'},
            ],
        });
        expect(sql).to.be.equal('CREATE TABLE my_table (id integer primary key, first_name text, age integer)');
    });
    it('sqliteAll', async () => {
        const db = new sqlite3.Database(':memory:');
        await sqliteRun(db, 'CREATE TABLE country (id integer primary key, native_name text, english_name text, domain text)');
        await sqliteRun(db, "INSERT INTO country (native_name, english_name, domain) VALUES ('Россия', 'Russia', 'ru')");
        await sqliteRun(db, "INSERT INTO country (native_name, english_name, domain) VALUES ('Österreich', 'Austria', 'at')");
        await sqliteRun(db, "INSERT INTO country (native_name, english_name, domain) VALUES ('Ελλάδα', 'Greece', 'gr')");
        const result = await sqliteAll(db, "SELECT id, domain, english_name FROM country ORDER BY domain");
        const count = await sqliteGet(db, 'SELECT COUNT(*) AS n FROM country');
        db.close();
        expect(result).to.deep.equal([
            {domain: 'at', english_name: 'Austria', id: 2},
            {domain: 'gr', english_name: 'Greece', id: 3},
            {domain: 'ru', english_name: 'Russia', id: 1},
        ]);
        expect(count).to.deep.equal({n: 3});
    });
    it('Escape', () => {
        expect(sqliteEscape('Hello')).to.be.equal("'Hello'");
        expect(sqliteEscape("D'Artagnan")).to.be.equal("'D''Artagnan'");
        expect(sqliteEscape(123)).to.be.equal("'123'");
    });
    it('makeFieldSql', () => {
        expect(makeFieldSql({name: 'descr', type: 'text'})).to.be.equal('descr text');
        expect(makeFieldSql({name: 'descr', type: 'text', notNull: true})).to.be.equal('descr text NOT NULL');
        expect(makeFieldSql({name: 'age', type: 'integer', defaultValue: 21})).to.be.equal("age integer DEFAULT '21'");
    });
});