/**
 * 
 * @param {string} tableName 
 * @param {Object} options 
 */
const makeInsert = (tableName, options) => {
    const {fields, values} = Object.keys(options).reduce((acc, field) => {
        acc.fields.push(field);
        acc.values.push(options[field]);
        return acc;
    }, {fields: [], values: []});
    const stubs = fields.map(() => '?');
    return {sql: `INSERT INTO ${tableName} (${fields.join(', ')}) VALUES (${stubs.join(', ')})`, values};
}

module.exports = {makeInsert};