const {sqliteRun, sqliteAll, sqliteGet, createTableOperator, makeFieldSql} = require('./sqliteAsync');

const createTable = async (db, descr, bLog) => {
    if (bLog) {
        console.log('Create table', descr.name);
    }
    const sql = createTableOperator(descr);
    return sqliteRun(db, sql);
}

const updateTable = async (db, descr, bLog) => {
    // Проверка сущестования таблицы.
    const count = await sqliteGet(db, `SELECT count(*) AS n FROM sqlite_master WHERE type='table' AND name='${descr.name}'`);
    if (!count.n) {
        if (bLog) {
            const s = `SELECT * FROM sqlite_master WHERE type='table' AND name='${descr.name}'`;
            console.log(s);
            const x = await sqliteAll(db, s);
            console.log('Tables', x);
        }
        // Если таблица не существует, то создать ее
        return createTable(db, descr, bLog);
    }
    // Получить список полей из существующей таблицы
    const realFieldsList = await sqliteAll(db, `PRAGMA table_info(${descr.name})`);
    // Первое поле всегда id. Поэтому его не проверяем
    const realMap = realFieldsList.reduce((dict, item, j) => {
        if (j !== 0) {
            dict[item.name] = item;
        }
        return dict;
    }, {});
    // Найти поля, которые есть в описании, но отсутствуют в реальной таблице
    const needFields = descr.fields;
    const fieldsToAdd = needFields.filter(fieldDescr => !(fieldDescr.name in realMap));
    return Promise.all(fieldsToAdd.map(async (fieldDescr) => {
        const sql = `ALTER TABLE ${descr.name} ADD COLUMN ${makeFieldSql(fieldDescr)}`;
        return sqliteRun(db, sql);
    }));
}

/**
 * @param {sqlite3.Database} db
 * @param {Array<{name: string}>} scheme
 * @param {boolean} bLog
 */
const updateDb = async (db, scheme, bLog = false) => {
    const tasks = scheme.map((descr) => updateTable(db, descr, bLog));
    return Promise.all(tasks);
}

module.exports = {updateDb};
