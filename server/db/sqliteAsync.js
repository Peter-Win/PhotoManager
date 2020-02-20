/**
 * Асинхронный адаптер для операций с sqlite3
 * Примеры использования
 * sql = "UPDATE tbl SET name = ? WHERE id = ?", params=[ "bar", 2 ]
 * sql = "UPDATE tbl SET name = $name WHERE id = $id", params = {$id: 2, $name: "bar"}
 * 
 * const {lastID} = await sqliteRun('INSERT INTO table (my_name) VALUES (?)', ['abcd'])
 *
 */

 const sqliteRun = async (db, sql, params) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        if (err) {
            reject(err);
        } else {
            const result = {...this};
            resolve(result);
        }
    });
 });

 const sqliteAll = async (db, sql, params) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
        if (err) {
            reject(err);
        } else {
            resolve(rows);
        }
    });
});

const sqliteGet = async (db, sql, params) => new Promise((resolve, reject) => {
    db.get(sql, params, (err, value) => {
        if (err) {
            reject(err);
        } else {
            resolve(value);
        }
    });
});

const sqliteEscape = value => {
    if (typeof value === 'string') {
        const newValue = value.replace(/\'/g, "''");
        return `'${newValue}'`;
    } else {
        return `'${+value}'`;
    }
}

/**
 * 
 * @param {Object} descr    Описание поля
 * @param {string} descr.name   Field name
 * @param {string} descr.type   text | integer | id
 * @param {boolean=} descr.notNull  признак NOT NULL
 * @param {string|number=} descr.defaultValue значение по умолчанию
 * @return {string}
 */
const makeFieldSql = ({name, type, notNull, defaultValue}) => {
    const sqlType = type === 'id' ? 'integer' : type;
    const params = [name, sqlType];
    if (notNull) {
        params.push('NOT NULL');
    }
    if (defaultValue !== undefined) {
        params.push(`DEFAULT ${sqliteEscape(defaultValue)}`);
    }
    return params.join(' ');
}

/**
 * Оператор создания таблицы по описанию
 * @param {{name:string, fields: Array<{name, type: string}>}} descr 
 * @returns {string}
 */
const createTableOperator = descr => {
    const fields = [
        'id integer primary key', // Это поле есть всегда в любой таблице
        ...descr.fields.map(rec => makeFieldSql(rec)),
    ];
    return `CREATE TABLE ${descr.name} (${fields.join(', ')})`;
}


module.exports = {sqliteRun, sqliteAll, sqliteGet, createTableOperator, makeFieldSql, sqliteEscape};