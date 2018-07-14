const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
  render: ({bat}, pixels) => {
    const batPix = bat.pixels();
    return pixels.map((row, y) => row.map((p, x) => batPix.map(p => p.x).includes(x) && batPix.map(p => p.y).includes(y) ? palette.primary : p));
  }
}
