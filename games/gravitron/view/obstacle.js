const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ obstacle }, pixels) => {
        return pixels.map((row, y) =>
            row.map((p, x) =>
                x === obstacle.x && y === obstacle.y
                    ? palette.primary
                    : p
            ));

    }
};
