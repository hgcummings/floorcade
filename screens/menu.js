const fs = require('fs');
const path = require('path');
const { fonts, renderPixels } = require("js-pixel-fonts");
const gameScreen = require('./game');
const input = require('../input');
const { Writable } = require('stream');

module.exports.init = () => {
    const games = fs.readdirSync('./games')
        .map(directory => ({
            workingDir: path.join('./games', directory),
            configFile: path.join('./games', directory, 'game.json')
        }))
        .filter(({configFile}) => fs.existsSync(configFile))
        .map(({workingDir, configFile}) => ({
            workingDir,
            ...require('../' + configFile.replace(/\\/g, '/'))
        }));

    let resolveNext, selected = 0, offset = 0;
    
    const nextPromise = new Promise((resolve) => {
        resolveNext = resolve;
    });

    const inputProcessor = new Writable({
        write(chunk, encoding, callback) {
            const action = chunk.toString('utf8');
            if (action[4] === '1') {
                const button = action.substr(2, 2);
                if (button == 'DU') {
                    selected = Math.max(0, selected - 1);
                    offset = Math.min(offset, selected);
                } else if (button == 'DD') {
                    selected = Math.min(games.length - 1, selected + 1);
                    offset = Math.max(offset, selected - 3);
                } else if (button[0] === 'F' || button[0] === 'S') {
                    resolveNext(gameScreen.init(games[selected]));
                }
            }
            callback();
        }
    });

    input(1, inputProcessor);

    const render = (width, height, stream) => {
        const font = fonts.sevenPlus;
        const items = games.map(game => ({
            game,
            pixels: renderPixels(game.title.toUpperCase(), font)
        }));
        const itemHeight = (font.lineHeight + 2);
        
        const lineBuffer = new Uint8Array(width * 3);
        for (let y = 0; y < height; ++y) {
            const itemIndex = Math.floor(y / itemHeight) + offset;
            const item = items[itemIndex];
            const invert = itemIndex === selected;
            const pixelsIndex = y % itemHeight - 1;
            if (item.pixels[pixelsIndex]) {
                for (let x = 0; x < width; ++x) {
                    for (z = 0; z < 3; ++z) {
                        if (item.pixels[pixelsIndex][x - 1]) {
                            lineBuffer[x * 3 + z] = invert ? 0 : 255; 
                        } else {
                            lineBuffer[x * 3 + z] = invert ? 255 : 0;
                        }
                    }
                }
            } else {
                for (let xz = 0; xz < width * 3; ++xz) {
                    lineBuffer[xz] = invert ? 255 : 0;
                }
            }
            stream.write(lineBuffer);
        }
    };
    
    return {
        render,
        next: () => nextPromise
    }
}
