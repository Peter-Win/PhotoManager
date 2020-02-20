const exec = require('child_process').exec;

/**
 * @returns {Promise<string[]>} Список драйверов в системе
 */
const getDrives = async () => {
    return new Promise((resolve, reject) => {
        exec('wmic logicaldisk get name', (error, stdout, stderr) => {
            if (error) {
              console.error(`exec error: ${error}`);
              reject(error);
            }
            // console.log('stdout ', stdout);
            resolve(stdout.split(/\s/).slice(1).filter(s => s));
        });
    });
}

module.exports = {getDrives};