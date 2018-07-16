"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EMPTY = 0;
exports.WALL = 99;
exports.init = ({ width, height }) => {
    const cells = [];
    for (let i = 0; i < height; i++) {
        const row = new Array(width).fill(exports.EMPTY);
        cells.push(row);
    }
    return cells;
};
//# sourceMappingURL=arena.js.map