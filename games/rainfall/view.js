const { fonts, renderPixels } = require("js-pixel-fonts");
const fs = require("fs");
const PNG = require('pngjs').PNG;



module.exports.init = (config) => {
    const frames = [];

    fs.readdirSync('./sourceImages').forEach((filename) => {
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
                frames.push(frame);
            }); 
    });

    const render = () => frames[2]; // serialise

    //const startTime = new Date().getTime();
    //const getTickRate = function () {
    //    return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    //};

    //const tick = () => {
    //    // update state
    //    setTimeout(tick, getTickRate(startTime));
    //};

    //setTimeout(tick, getTickRate(startTime));

    return {
        render
    };
}
