/**
 * @param {Object} params
 * @param {sqlite3.Database?} params.db
 * @param {number} params.id
 * @param {string} params.basePath
 * @param {string} params.pathType = fileRoot | fileFrame
 */
const makeObjectPath = async (params) => {
	return params.basePath;
};

module.exports = {makeObjectPath};