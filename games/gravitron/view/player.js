const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ player }, pixels) => {
        return pixels.map((row, y) =>
            row.map((p, x) =>
                y === player.y && x === player.x ? palette.secondary: p));

    }
};
