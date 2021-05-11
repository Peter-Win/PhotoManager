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
        {name: 'mainFrameId', type: 'id', comment: 'фрейм, который является иконкой папки'},
    ],
};

const schemeFrame = {
    name: 'frame',
    fields: [
        {name: 'folderId', type: 'id'}, // TODO: Нужен индекс
        {name: 'title', type: 'text'},
        {name: 'descr', type: 'text'},
        {name: 'lat', type: 'real' },
        {name: 'lng', type: 'real'},
        {name: 'quality', type: 'integer'},
        {name: 'role', type: 'integer'}, // 1=image, 2=video
        {name: 'mainFileId', type: 'id'},
        {name: 'dateTime', type: 'integer'}, // The date and time of image creation. GMT=0
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