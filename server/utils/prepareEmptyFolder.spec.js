const {expect} = require('chai');
const fs = require('fs');
const path = require('path');
const {prepareEmptyFolder} = require('./prepareEmptyFolder');

describe('prepareEmptyFolder', () => {
    const commonPath = path.join(__dirname, 'test');
    beforeAll(() => {
        if (!fs.existsSync(commonPath)) {
            fs.mkdir(commonPath);
        }
    });

    it('create new folder', async () => {
        const testPath = path.join(commonPath, 'prepareEmptyFolderNew');
        // Если папка есть, то удалить
        if (fs.existsSync(testPath)) {
            fs.rmdirSync(testPath);
        }
        // Создать
        await prepareEmptyFolder(testPath);
        // Проверить наличие. Если не создана, то ошибка
        expect(fs.existsSync(testPath)).to.be.true;
    });

    it('clear folder', async () => {
        const testPath = path.join(commonPath, 'prepareEmptyFolderExists');
        // Если папки нет, создать
        if (!fs.existsSync(testPath)) {
            fs.mkdirSync(testPath);
        }

        // Создать в ней файлы
        const filesCount = 10;
        for (let i=0; i<filesCount; i++) {
            const fileName = path.join(testPath, `file${i}.txt`);
            const fileData = `Test # ${i}`;
            fs.writeFileSync(fileName, fileData);
        }
        // Создать еще вложенную папку
        const subfolderName = path.join(testPath, 'subfolder');
        if (!fs.existsSync(subfolderName)) {
            fs.mkdirSync(subfolderName);
        }
        // Файл во вложенной папке
        fs.writeFileSync(path.join(subfolderName, 'test.txt'), 'This is test');

        // Убедиться, что файлы созданы
        const fileList1 = fs.readdirSync(testPath);
        expect(fileList1).to.have.lengthOf(filesCount + 1);

        await prepareEmptyFolder(testPath);

        // Теперь папка должна быть пустая
        const fileList2 = fs.readdirSync(testPath);
        expect(fileList2).to.have.lengthOf(0);
    });
});