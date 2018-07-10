const fs = require('fs');
const path = require('path');

module.exports.list = () =>
    fs.readdirSync('./games')
        .map(directory => ({
            workingDir: path.join('./games', directory),
            configFile: path.join('./games', directory, 'game.json')
        }))
        .filter(({configFile}) => fs.existsSync(configFile))
        .map(({workingDir, configFile}) => ({
            workingDir,
            ...require('../' + configFile.replace(/\\/g, '/'))
        }));