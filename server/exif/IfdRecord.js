const fs = require('fs');
const {ExifTypes} = require('./ExifTypes');
const {ExifTypeCodes} = require('./ExifTypes');
const {Tags} = require('./Tags');

class IfdRecord {
    static length = 12;
    /**
     * Рекомендуемый способ создания одиночной записи
     * @param {fs.FileHandle} fileHandle 
     * @param {number} position 
     * @param {number} basePosition 
     * @param {boolean} isBigEndian
     * @returns {IfdRecord}
     */
    static async create(fileHandle, position, basePosition, isBigEndian) {
        const inst = new IfdRecord(fileHandle, basePosition, isBigEndian);
        await inst.readFromFile(position);
        return inst;
    }

    /**
     * Записи эффективнее читать одним блоком, а потом каждую создавать из общего буфера
     * @param {Buffer} buffer 
     * @param {number} offset 
     * @param {fs.FileHandle} fileHandle Нужен в дальнейшем для getValue()
     * @param {number} basePosition 
     * @param {boolean} isBigEndian 
     * @returns {IfdRecord}
     */
    static createFromBuffer(buffer, offset, fileHandle, basePosition, isBigEndian) {
        const inst = new IfdRecord(fileHandle, basePosition, isBigEndian);
        inst.readFromBuffer(buffer.slice(offset, offset + IfdRecord.length));
        return inst;
    }

    constructor(fileHandle, basePosition, isBigEndian) {
        this.fileHandle = fileHandle;
        this.basePosition = basePosition;
        this.isBigEndian = isBigEndian;
        this.tag = 0;
        this.typeId = 0;
        this.count = 0;
        this._buffer = null;
    }

    async readFromFile(position) {
        const buf = Buffer.alloc(IfdRecord.length);
        await this.fileHandle.read(buf, 0, IfdRecord.length, position);
        this.readFromBuffer(buf);
    }

    readFromBuffer(buf) {
        this._buffer = buf;
        // Bytes 0-1  Tag 
        this.tag = ExifTypes.SHORT.read(buf, 0, this.isBigEndian);
        // Bytes 2-3 Type 
        this.typeId = ExifTypes.SHORT.read(buf, 2, this.isBigEndian);
        // Bytes 4-7 Count 
        this.count = ExifTypes.LONG.read(buf, 4, this.isBigEndian);
    }

    /**
     * @returns {{id: number, name: string, length: number, read: function(buffer:Buffer, offset: number, isBigEndian: boolean) }
     */
    getType() {
        return ExifTypeCodes[this.typeId];
    }

    /**
     * @returns {string}
     */
    getTagName() {
        const tagName = Tags[this.tag];
        return tagName || this.tag.toString(16).toUpperCase();
    }

    /**
     * @returns {number} data length in bytes
     */
    getLength() {
        const type = this.getType();
        return type ? type.length * this.count : 0;
    }

    /**
     * @returns {boolean} true, if data located outside of IFD record
     */
    isExternalData() {
        return this.getLength() > 4;
    }

    calcPosition(relativeOffset) {
        return relativeOffset + this.basePosition;
    }

    getExternalOffset() {
        const offset = ExifTypes.LONG.read(this._buffer, 8, this.isBigEndian);
        return this.calcPosition(offset);
    }

    async getValue() {
        const type = this.getType();
        if (!type) {
            return null;
        }
        const totalLength = this.getLength();
        let buf = null;
        let bufOffset = 0;
        // Bytes 8-11 Value Offset
        if (this.isExternalData()) {
            buf = Buffer.alloc(totalLength);
            await this.fileHandle.read(buf, 0, totalLength, this.getExternalOffset());
        } else {
            // If the value is smaller than 4 bytes, the value is stored in the 4-byte area starting from the left
            buf = this._buffer;
            bufOffset = 8;
        }
        if (type.name === 'ASCII') {
            const s = buf.toString('ascii', bufOffset, bufOffset + totalLength - 1);
            const zeroPos = s.indexOf('\u0000');
            return zeroPos < 0 ? s : s.slice(0, zeroPos);
        }
        if (type.name === 'UNDEFINED') {
            return buf.slice(bufOffset, bufOffset + totalLength);
        }
        if (this.count === 1) {
            return type.read(buf, bufOffset, this.isBigEndian);
        }
        const result = [];
        for (let i = 0; i < this.count; i++) {
            result.push(type.read(buf, bufOffset, this.isBigEndian));
            bufOffset += type.length;
        }
        return result;
    }
};

module.exports = {IfdRecord};