const { fonts, renderPixels } = require('js-pixel-fonts'); 
const log = require('../log');
const colours = require('./colours');

/*
 * Renders the level in which you're dodging loads bullets, matrix-style.
 * Assumes standard (height, width) of (72, 36):
 * - Height of X pixels for main play area
 * - Footer of Y pixels for score
 */
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

    // Scores
    players.forEach(player => {
        const colour = colours[player.id];

        const FONT = fonts.slumbers;
        const maxWidth = 3;
        const scorePixels = renderPixels(player.score.toString(), FONT);
        for (let j = 0; j < scorePixels.length; ++j) {
            for (let i = 0; i < scorePixels[j].length; ++i) {
                if (scorePixels[j][i]) {
                    renderColoursAtPixel(colour, i + 1, j + 1)
                }
            }
        }
    })
};
