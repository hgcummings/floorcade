const wall = require('./wall');
const player = require('./player');
const obstacle = require('./obstacle');

const palette = require('./palette.js');
const _ = require('lodash');

module.exports.init = ({ width, height }) => {
    const background = new Array(height).fill(new Array(width).fill(palette.background));
    const render = state => {
        let pixels = background;
        state.players.forEach(b => pixels = player.render({ player: b }, pixels));
        state.obstacles.forEach(b => pixels = obstacle.render({ obstacle: b }, pixels));
        state.walls.forEach(b => pixels = wall.render({ wall: b }, pixels));
        return (new Uint8Array(_.flattenDeep(pixels)));
    };

    return {
        render
    };
};
