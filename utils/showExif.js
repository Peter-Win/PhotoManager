/**
 * Вывод структуры EXIF для указанного файла.
 */
const path = require('path');
const fs = require('fs');
const {findExif} = require('../server/exif/findExif');
const {checkTiffHeader} = require('../server/exif/checkTiffHeader');
const {ExifStructure} = require('../server/exif/ExifStructure');
const {IfdBlock} = require('../server/exif/IfdBlock');

const drawRecord = async (record, j) => {
    const value = await record.getValue();
    const type = record.getType();
    let typeName = type.name;
    if (record.count !== 1) {
        typeName += `[${record.count}]`;
    }
    let svalue = JSON.stringify(value);
    if (svalue.length > 128) {
        svalue = svalue.slice(0, 128) + '...';
    }
    if (record.getTagName() === 'JPEGInterchangeFormat') {
        svalue = 'Offset=' + record.getExternalOffset().toString(16).toUpperCase();
    }
    console.log(' ', j+1, record.getTagName(), ':', typeName, '=', svalue);
    const res = {};
    if (record.tag === 0x8769) { // Exif IFD Pointer
        res.exifPos = record.getExternalOffset();
    }
    return res;
}

const drawBlock = async (block, header) => {
    console.log(header);
    let spec = {};
    for (let j = 0; j < block.record.length; j++) {
        const record = block.record[j];
        const res = await drawRecord(record, j);
        spec = {...spec, ...res};
    }

    if (spec.exifPos) {
        const blockExif = await IfdBlock.create(block.fileHandle, spec.exifPos, block.basePosition, block.isBigEndian);
        await drawBlock(blockExif, 'Exif IFD');
    }
}

const work = async (fileHandle) => {
    try {
        const basePosition = await findExif(fileHandle);
        if (basePosition === null) {
            console.log('EXIF not found');
            return;
        }
        const hdr = await checkTiffHeader(fileHandle, basePosition);
        if (!hdr) {
            console.log('Invalid EXIF');
            return;
        }
        const struc = await ExifStructure.create(fileHandle, basePosition);
        for (let i = 0; i < struc.ifd.length; i++) {
            const block = struc.ifd[i];
            await drawBlock(block, `* IFD ${i}`);
        }
    } finally {
        fileHandle.close();
    }
}

const main = async (fileName) => {
//    try {
        const fileHandle = await fs.promises.open(fileName, 'r');
        await work(fileHandle);
//    } catch(e) {
//        console.log('Error:', e.message);
//    }
}

const fileName = process.argv[2];
if (!fileName) {
    console.log('You must specify a file name.');
    process.exit(-1);
}
console.log('File name: ', fileName);
if (!fs.existsSync(fileName)) {
    console.log('File not found:',fileName);
    process.exit(-1);
}
main(fileName);