const {expect} = require('chai');
const sqlite3 = require('sqlite3').verbose();
const {updateDb} = require('./updateDb');
const {sqliteAll, sqliteRun, createTableOperator} = require('./sqliteAsync');

describe('updateDb', () => {
    it('create table', async () => {
        const db = new sqlite3.Database(':memory:');
        const scheme = [
            {
                name: 'test_table',
                fields: [
                    {name: 'string_field', type: 'text', notNull: true}
                ],
            },
        ];
        await updateDb(db, scheme);
        const info = await sqliteAll(db, 'PRAGMA table_info(test_table)');
        expect(info).to.have.lengthOf(2);
        expect(info[0]).to.include({name: 'id', type: 'integer', notnull: 0, dflt_value: null});
        expect(info[1]).to.include({name: 'string_field', type: 'text', notnull: 1, dflt_value: null});
        db.close();
    });

    it('add field', async () => {
        const db = new sqlite3.Database(':memory:');
        const initialTableSql = createTableOperator({
            name: 'main_table',
            fields: [
                {name: 'first_field', type: 'text'},
            ],
        });
        await sqliteRun(db, initialTableSql);
        const info1 = await sqliteAll(db, 'PRAGMA table_info(main_table)');
        expect(info1).to.have.lengthOf(2);
        expect(info1[1]).to.include({name: 'first_field', type: 'text'});
        const scheme = [
            {
                name: 'main_table',
                fields: [
                    {name: 'first_field', type: 'text'},
                    {name: 'second_field', type: 'text'},
                ],
            }
        ];
        await updateDb(db, scheme, true);
        const info2 = await sqliteAll(db, 'PRAGMA table_info(main_table)');
        expect(info2).to.have.lengthOf(3);
        expect(info2[1]).to.include({name: 'first_field', type: 'text'});
        expect(info2[2]).to.include({name: 'second_field', type: 'text'});
    });
});
