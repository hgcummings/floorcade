const log = require('../log');

const colours = require('./colours');

module.exports.render = ({players, bullets}, pixels, {width, height}) => {
    const renderColoursAtPixel = (rgb, x, y) => {
        for (let c = 0; c < 3; ++c) {
            const target = (((y * width) + x) * 3) + c;
            pixels[target] = rgb[c];
        }
    }
    players.forEach(player => {
        const colour = player.alive ? colours[player.id] : [128,128,128];
        // Make the spaceship a 3x3 blob. So majestic. Wowe.
        for (let dx = -player.dwidth; dx <= player.dwidth; dx++) {
            for (let dy = -player.dheight; dy <= player.dheight; dy++) {
                renderColoursAtPixel(colour, player.x + dx, player.y + dy);
            }
        }
    });

    bullets.forEach(b =>{
        renderColoursAtPixel([255,0,55],Math.round(b.x), Math.round(b.y));
    })
};
