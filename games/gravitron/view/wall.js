const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ wall }, pixels) => {
        return pixels.map((row, y) =>
            row.map((p, x) =>
                y === wall.y ? palette.primary : p));

    }
};
