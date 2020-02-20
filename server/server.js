const fs = require('fs')
const path = require('path')
const express = require('express')
const app = express()

// Minimum version of NodeJS = 12
const ver = process.versions.node.split('.')[0];
if (+ver < 12) {
    console.error(`*****************************************
Minimum version of Node.js is 12 for this application.
Your version: ${process.versions.node}.
Please, install a new version of Node.js.
*****************************************`);
    process.exit(-1);
}

// command line analys
const argv = process.argv
const bShow = !!argv.find(param => param === '-show')
const bHelp = !!argv.find(param => param === '-h' || param === '-help' || param === '-?')
const bOptions = !!argv.find(param => param[0] === '-')
const iPort = argv.findIndex(param => param === '-p')
const port = (iPort >= 0 ? argv[iPort + 1] : '') || '3000'
const clientUrl = `http://localhost:${port}`


// check client
// Необходимо убедиться, что выполнен билд клиентской части приложения.
const clientFilePath = path.join(__dirname, '../client/dist/index.html')
try {
    app.post('/rest/folder', (request, response) => {
        const {handler} = require('./rest/postFolder');
        handler.exec(request, response);
    });
    fs.accessSync(clientFilePath, fs.constants.R_OK)
    app.get('/:name', (request, response) => {
        response.sendFile(path.join(__dirname, '../client/dist', request.params.name))
    })
    app.get('/', (request, response) => {
        response.sendFile(clientFilePath)
    })
} catch (err) {
    console.log('*** General error detected: Application build required ***')
    app.get('/', (request, response) => response.sendFile(path.join(__dirname, 'instruction/build.html')))
}

// display the usage
if (bHelp) {
    console.log('Usage:')
    console.log('  -show - open PhotoManager in browser')
    console.log('  -p NNN - use port NNN, for example -p 3003')
} else if (!bOptions) {
    console.log('Use -h or -? to view command line options')
}

if (bShow) {
    // Open client in web browser
    console.log('Auto open the web browser.')
    const open = require('open');
 
    (async () => {
        await open(clientUrl)
    })();
} else {
    console.log('Open this URL in your browser:', clientUrl)
}

console.log('Use Ctrl+C to stop this server.')
app.listen(port)
