const _ = require('lodash');

module.exports = {
  render: ({bat}, pixels) => {
    return pixels.map((row, y) => row.map((p, x) => x === bat.x && y === bat.y ? [0,255,0] : p));
  }
}
