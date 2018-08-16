const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ wall }, pixels) => {
        return pixels.map((row, y) =>
            row.map((p, x) => {
                    if (wall.indentsX && wall.indentsX.find(wx => Math.abs(wx - x) < 2)) {
                        const indentY = wall.top ? wall.y - 1 : wall.y + 1;
                        return y === indentY ? palette.primary : p;
                    }
                    else {
                        return y === wall.y ? palette.primary : p;
                    }
                }
            )
        );
    }
};
