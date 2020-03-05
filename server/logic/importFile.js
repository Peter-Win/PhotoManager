const importFile = async (db, fileId, fullFilePath) => {
    const ext = ...(fullFilePath);
    const {frameId} = await sqliteGet(db, 'SELECT frameId FROM file WHERE id=?', [fileId]);
    const {folder}
};

modules.exports = {importFile};