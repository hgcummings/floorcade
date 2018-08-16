const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ player }, pixels) => {
        return pixels.map((row, y) =>
            row.map((pixel, x) =>
                player.playerCoords().find(c => (c[0] === x || c[0] + player.screenWidth === x || c[0] - player.screenWidth === x)
                    && c[1] === y)
                    ? palette.players[player.id - 1]
                    : pixel
            ));

    }
};
