const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const getDataPath = () => {
    return path.normalize(path.join(__dirname, '..', 'data'));
}

const createContext = () => {
    const dataPath = getDataPath();
    if (!fs.existsSync(dataPath)) {
        fs.mkdirSync(dataPath);
    }
    const mediaPath = path.join(dataPath, 'media');
    if (!fs.existsSync(mediaPath)) {
        fs.mkdirSync(mediaPath);
    }
    return Object.freeze({
        mediaPath,
        db: new sqlite3.Database(path.join(dataPath, 'main.db')),
        keyYandexMap: 'a05947f4-cf42-49f7-a50a-ab28c1e19cae',
    });
};

module.exports = {createContext, getDataPath};