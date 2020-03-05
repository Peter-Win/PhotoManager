// fields:
// - name: string
// - type: id | integer | text | real | blob
// - notNull?: boolean
// - defaultValue?: string | number

const schemeFolder = {
    name: 'folder',
    fields: [
        {name: 'ownerId', type: 'id'},
        {name: 'title', type: 'text'},
        {name: 'descr', type: 'text'},
    ],
};

const schemeFrame = {
    name: 'frame',
    fields: [
        {name: 'folderId', type: 'id'},
        {name: 'title', type: 'text'},
        {name: 'descr', type: 'text'},
        {name: 'lat', type: 'real' },
        {name: 'lng', type: 'real'},
        {name: 'quality', type: 'integer'},
        {name: 'role', type: 'integer'}, // 1=image, 2=video
        {name: 'mainFileId', type: 'id'},
    ],
};
                   
const schemeFile = {
    name: 'file',
    fields: [
        {name: 'frameId', type: 'id'},
        {name: 'ext', type: 'text'},
    ],
};

const schemesList = [
    schemeFolder,
    schemeFrame,
    schemeFile,
];

module.exports = {
    schemeFolder,
    schemeFrame,
    schemeFile,
    schemesList,
}