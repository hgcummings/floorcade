const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
    render: ({ wall, players, obstacles }, pixels) => {
        const indents = [
            ..._.flatMap(players, p => p.playerCoords()).filter(c => c[1] === wall.y || c[1] === wall.y -1 || c[1] === wall.y + 1),
            ...obstacles.filter(o => o.y === wall.y).map(o => [o.x, o.y])
        ];
        return pixels.map((row, y) =>
            row.map((pixel, x) => {
                    if (indents.length > 0 && indents.find(coord => Math.abs(coord[0] - x) < 2)) {
                        const indentY = wall.top ? wall.y - 1 : wall.y + 1;
                        return y === indentY ? palette.walls : pixel;
                    }
                    else {
                        return y === wall.y ? palette.walls : pixel;
                    }
                }
            )
        );
    }
};
