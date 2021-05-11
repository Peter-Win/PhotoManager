/**
 * 
 * @param {string} strValue Строковое представление даты и времени, принятое для EXIF
 * @returns {Date}
 */
const exifDateTime = strValue => {
    const [d, t] = strValue.split(' ');
    const iso = `${d.replace(/:/g, '-')} ${t}.000Z`;
    return new Date(iso);
};

module.exports = {exifDateTime};