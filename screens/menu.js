const fs = require('fs');
const path = require('path');
const { fonts, renderPixels } = require("js-pixel-fonts");

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

    console.log(games);

    let resolveNext;
    let selected = 0;

    const render = (width, height, socket) => {
        const font = fonts.sevenPlus;
        const items = games.map(game => ({
            game,
            pixels: renderPixels(game.title, font)
        }));
        const itemHeight = (font.lineHeight + 2);
        
        const lineBuffer = new Uint8Array(width * 3);
        for (let y = 0; y < height; ++y) {
            const item = items[Math.floor(y / itemHeight)];
            const pixelsIndex = y % itemHeight - 1;
            if (item.pixels[pixelsIndex]) {
                for (let x = 0; x < width; ++x) {
                    for (z = 0; z < 3; ++z) {
                        if (item.pixels[pixelsIndex][x]) {
                            lineBuffer[x * 3 + z] = 0; 
                        } else {
                            lineBuffer[x * 3 + z] = 255;
                        }
                    }
                }
            } else {
                for (let xz = 0; xz < width * 3; ++xz) {
                    lineBuffer[xz] = 0;
                }
            }
            stream.write(lineBuffer);
    
        }
    }

    const nextPromise = new Promise((resolve, reject) => {
        resolveNext = resolve;
    });

    return {
        render,
        next: () => nextPromise
    }
}
