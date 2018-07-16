"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const colours = require('./colours');
exports.render = ({ arena, players }, pixels) => {
    const [width, height] = [arena[0].length, arena.length];
    for (let y = 0; y < height; ++y) {
        for (let x = 0; x < width; ++x) {
            const colour = colours[arena[y][x]];
            for (let c = 0; c < 3; ++c) {
                pixels[(((y * width) + x) * 3) + c] = colour[c];
            }
        }
    }
    players.forEach(player => {
        const colour = player.alive ? colours[player.id] : [128, 128, 128];
        for (let c = 0; c < 3; ++c) {
            pixels[(((player.y * width) + player.x) * 3) + c] = colour[c];
        }
    });
};
//# sourceMappingURL=round.js.map