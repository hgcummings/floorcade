const palette = require('./palette.js');
const _ = require('lodash');

module.exports = {
  render: ({ball}, pixels) => {
    const ballPix = ball.pixels();
    return pixels.map((row, y) =>
      row.map((p, x) =>
        ballPix.map(p => p.x).includes(x) && ballPix.map(p => p.y).includes(y) ? palette.secondary : p
      )
    );
  }
}
