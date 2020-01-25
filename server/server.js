const express = require('express')
const app = express()

// command line analys
const argv = process.argv
const bShow = !!argv.find(param => param === '-show')
const bHelp = !!argv.find(param => param === '-h' || param === '-help' || param === '-?')
const bOptions = !!argv.find(param => param[0] === '-')
const iPort = argv.findIndex(param => param === '-p')
const port = (iPort >= 0 ? argv[iPort + 1] : '') || '3000'
const clientUrl = `http://localhost:${port}`

app.get('/', function (req, res) {
    res.send('Hello World')
})

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
    const open = require('open');
 
    (async () => {
        await open(clientUrl)
        console.log('Auto open the web browser')
    })();
} else {
    console.log('Open this URL in your browser:', clientUrl)
}

app.listen(port)