const { fonts, renderPixels } = require("js-pixel-fonts");
const fs = require("fs");
const PNG = require('pngjs').PNG;


module.exports.init = (config) => {
    const frames = [];

    const sourceImageNames = fs.readdirSync('./sourceImages');
    
    const filePromises = sourceImageNames.sort().map((filename, i) => new Promise(
        (resolve, _) => {
        fs.createReadStream(`./sourceImages/${filename}`)
            .pipe(new PNG({
                filterType: 4
            }))
            .on('parsed', function() {
                const frame = new Uint8Array(config.width * config.height * 3).fill(0);
                let offsetY = 200;
                let offsetX = 200;
                for (let y=0; y<config.height; y++) {
                    for (let x=0; x<config.width; x++) {
                        let i = config.width*y*3 + x*3;
                        let j = this.width*(y+offsetY)*4 + (x+offsetX)*4;
                        frame[i] = this.data[j];
                        frame[i+1] = this.data[j+1];
                        frame[i+2] = this.data[j+2];
                    }
                }
                drawTimestamp(frame, Math.floor(config.width / 2), filename.slice(11,16), 20);
                frames[i] = frame;
                resolve();
            }); 
        }));

    const allPromises = Promise.all(filePromises);

    const drawTimestamp = (frame, offset, timestamp, maxWidth) => {
        const scorePixels = renderPixels(timestamp, fonts.slumbers);
        const leftEdge = (offset + maxWidth) - scorePixels[0].length - 2;
        for (let j = 0; j < scorePixels.length; ++j) {
            for (let i = 0; i < scorePixels[j].length; ++i) {
                for (let z = 0; z < 3; ++z) {
                    if (scorePixels[j][i]) {
                        frame[((leftEdge + i + 1) + ((j + 1) * config.width)) * 3 + z] = 255;
                    }
                }
            }
        }
    };
    const render = (frameIndex) => frames[frameIndex];

    return {
        nFrames: sourceImageNames.length,
        loading: allPromises,
        render
    };
}
