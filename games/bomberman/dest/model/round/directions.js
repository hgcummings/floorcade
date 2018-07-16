"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validDirections = {
    1: { dx: 0, dy: -1 },
    3: { dx: 1, dy: -1 },
    2: { dx: 1, dy: 0 },
    6: { dx: 1, dy: 1 },
    4: { dx: 0, dy: 1 },
    12: { dx: -1, dy: 1 },
    8: { dx: -1, dy: 0 },
    9: { dx: -1, dy: -1 }
};
exports.components = d => exports.validDirections[d];
//# sourceMappingURL=directions.js.map