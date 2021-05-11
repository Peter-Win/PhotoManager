const path = require('path');
const fs = require('fs');
const {expect} = require('chai');
const sqlite3 = require('sqlite3').verbose();
const {sqliteRun, createTableOperator} = require('../../db/sqliteAsync');
const {prepareEmptyFolder} = require('../../utils/prepareEmptyFolder');
const {createFolder} = require('./createFolder');
const {createFolderTable} = require('../../utils/createTable');

describe('createFolder', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdirSync(commonPath);
        }
    });
    it('main', async () => {
        const testPath = path.join(commonPath, 'createFolderMain');
        await prepareEmptyFolder(testPath);

        // Подготовить БД
        const db = new sqlite3.Database(':memory:');
        await createFolderTable(db);
 
        // Тестируемая функция
        const {id, fullFolderName} = await createFolder(db, 0, testPath);
 
        expect(typeof id).to.be.equal('number');
        expect(id).to.be.equal(1);

        // Проверить наличие папки
        expect(fs.existsSync(fullFolderName)).to.be.true;
        // Проверить наличие записи в таблице
    });
});