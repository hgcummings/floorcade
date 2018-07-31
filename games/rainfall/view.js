const { fonts, renderPixels } = require("js-pixel-fonts");
const fs = require("fs");
const PNG = require('pngjs').PNG;



module.exports.init = (config) => {
    const frame = new Uint8Array(config.width * config.height * 3).fill(0);

    fs.createReadStream('fullOpacity.png')
        .pipe(new PNG({
            filterType: 4
        }))
        .on('parsed', function() {
            for (let y=0; y<config.height; y++) {
                for (let x=0; x<config.width; x++) {
                    let i = config.width*y*3 + x*3;
                    let j = this.width*y*4 + x*4;
                    frame[i] = 255; //this.data[i];
                    frame[i+1] = 0; //this.data[i+1];
                    frame[i+2] = 0; //this.data[i+2];
                }
            }
        }); 

    const render = () => frame; // serialise

    return {
        render
    };
}
