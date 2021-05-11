const {ExifTypes} = require('./ExifTypes');
const {IfdBlock} = require('./IfdBlock');
const {checkTiffHeader} = require('./checkTiffHeader');

class ExifStructure {
    /**
     * Рекомендуемый способ создания
     * @param {FileHandle} fileHandle 
     * @param {number} basePosition
     * @returns {ExifStructure}
     */
    static async create(fileHandle, basePosition) {
        const inst = new ExifStructure(fileHandle, basePosition);
        await inst.load();
        return inst;
    }

    /**
     * @param {FileHandle} fileHandle 
     * @param {number} basePosition 
     */
    constructor(fileHandle, basePosition) {
        this.fileHandle = fileHandle;
        this.basePosition = basePosition;
        this.isBigEndian = false;
        this.ifd = [];
    }

    async load() {
        const hdr = await checkTiffHeader(this.fileHandle, this.basePosition);
        if (!hdr) {
            throw new Error('Invalid EXIF');
        }
        this.isBigEndian = hdr.isBigEndian;
        // load IFD blocks
        let position = hdr.startPosition;
        while (position !== 0) {
            const block = new IfdBlock(this.fileHandle, this.basePosition, this.isBigEndian);
            await block.load(position);
            this.ifd.push(block);
            position = block.nextPos;
        }
    }
};

module.exports = {ExifStructure};