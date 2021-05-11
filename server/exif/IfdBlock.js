const fs = require('fs');
const {ExifTypes} = require('./ExifTypes');
const {IfdRecord} = require('./IfdRecord');

class IfdBlock {
    static async create(fileHandle, position, basePosition, isBigEndian) {
        const inst = new IfdBlock(fileHandle, basePosition, isBigEndian);
        await inst.load(position);
        return inst;
    }
    /**
     * 
     * @param {FileHandle} fileHandle 
     * @param {number} basePosition 
     * @param {boolean} isBigEndian 
     */
    constructor(fileHandle, basePosition, isBigEndian) {
        this.fileHandle = fileHandle;
        this.basePosition = basePosition;
        this.isBigEndian = isBigEndian;
        /**
         * {IfdRecord[]}
         */
        this.record = [];
        /**
         * absolute position of next IFD block
         */
        this.nextPos = 0;
    }

    async load(position) {
        // read count
        const countBuf = Buffer.alloc(2);
        await this.fileHandle.read(countBuf, 0, 2, position);
        const count = ExifTypes.SHORT.read(countBuf, 0, this.isBigEndian);

        // read block
        const buf = Buffer.alloc(count * IfdRecord.length + 4);
        await this.fileHandle.read(buf, 0, buf.length, position + 2);

        // create ifd records
        let offset = 0;
        for (let i = 0; i < count; i++) {
            const record = IfdRecord.createFromBuffer(buf, offset, this.fileHandle, this.basePosition, this.isBigEndian);
            this.record.push(record);
            offset += IfdRecord.length;
        }

        // offset of next ifd
        const next = ExifTypes.LONG.read(buf, offset, this.isBigEndian);
        if (next) {
            this.nextPos = this.basePosition + next;
        }
    }

    /**
     * Найти запись по идентификатору или названию тега.
     * Быстрее работает вариант с числовым идентификатором.
     * @param {number | string} tag
     * @returns {IfdRecord | null}
     */
    find(tag) {
        const testId = (record) => record.tag === tag;
        const testName = (record) => record.getTagName() === tag;
        return this.record.find(typeof tag === 'string' ? testName : testId) || null;
    }
}

module.exports = {IfdBlock};