const path = require('path');
const fs = require('fs');
const {createContext, getDataPath} = require('../server/createContext');
const {updateDb} = require('../server/db/updateDb');
const {schemesList} = require('../server/db/schemes');
const {createEnvironment} = require('../server/utils/createTestEnvironment');
const {prepareEmptyFolder} = require('../server/utils/prepareEmptyFolder');

const work = async () => {
    console.log('Data path:', getDataPath());
    await prepareEmptyFolder(getDataPath());

    const context = createContext();
    // await updateDb(context.db, schemesList);
    console.log('mediaPath=', context.mediaPath);
    const addFiles = ['withExif.jpg', 'town.jpg'].map(r => ({name: r, title: r}));
    await createEnvironment(context.db, context.mediaPath, {addFiles, title: 'Main folder'});
}
work();