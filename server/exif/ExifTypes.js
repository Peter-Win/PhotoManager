const ExifTypes = Object.freeze({
    BYTE: { // An 8-bit unsigned integer
        id: 1,
        name: 'BYTE',
        length: 1,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            return buffer.readUInt8(offset);
        },
    },
    ASCII: { // An 8-bit byte containing one 7-bit ASCII code. The final byte is terminated with NULL
        id: 2,
        name: 'ASCII',
        length: 1,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            return buffer[offset];
        },
    },
    SHORT: { // A 16-bit (2-byte) unsigned integer
        id: 3,
        name: 'SHORT',
        length: 2,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            return isBigEndian ? buffer.readUInt16BE(offset) : buffer.readUInt16LE(offset);
        },
    },
    LONG: { // A 32-bit (4-byte) unsigned integer
        id: 4,
        name: 'LONG',
        length: 4,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            return isBigEndian ? buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
        },
    },
    RATIONAL: { // Two LONGs. The first LONG is the numerator and the second LONG expresses the denominator.
        id: 5,
        name: 'RATIONAL',
        length: 8,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            const a = isBigEndian ? buffer.readUInt32BE(offset) : buffer.readUInt32LE(offset);
            if (a === 0) {
                return 0;
            }
            const b = isBigEndian ? buffer.readUInt32BE(offset + 4) : buffer.readUInt32LE(offset + 4);
            return a / b;
        },
    },
    UNDEFINED: {
        id: 7,
        name: 'UNDEFINED',
        length: 1,
        read: (buffer, offset, isBigEndian) => {
            return buffer[offset];
        },
    },
    SLONG: { // A 32-bit (4-byte) signed integer (2's complement notation), 
        id: 9,
        name: 'SLONG',
        length: 4,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            return isBigEndian ? buffer.readInt32BE(offset) : buffer.readInt32LE(offset);
        },
    },
    SRATIONAL: { // Two SLONGs. The first SLONG is the numerator and the second SLONG is the denominator. 
        id: 10,
        name: 'SRATIONAL',
        length: 8,
        /**
         * @param {Buffer} buffer
         * @param {number} offset
         * @param {boolean} isBigEndian
         * @return {number}
         */
        read: (buffer, offset, isBigEndian) => {
            const a = isBigEndian ? buffer.readInt32BE(offset) : buffer.readInt32LE(offset);
            if (a === 0) {
                return 0;
            }
            const b = isBigEndian ? buffer.readInt32BE(offset + 4) : buffer.readInt32LE(offset + 4);
            return a / b;
        },
    },
});

const ExifTypeCodes = Object.freeze(Object.values(ExifTypes).reduce((arr, info) => {
    arr[info.id] = info;
    return arr;
}, []));

module.exports = { ExifTypes, ExifTypeCodes };