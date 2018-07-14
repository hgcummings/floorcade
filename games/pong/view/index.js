// const arena = import('./arena');
const palette = require('./palette.js');
const bat = require('./bat.js');
const _ = require('lodash');

module.exports.init = ({width, height}) => {
  const background = new Array(height).fill(new Array(width).fill(palette.background));
  const render = state => {
      let pixels = background;
      pixels = bat.render(state, pixels);
      return (new Uint8Array(_.flattenDeep(pixels)));
  }

    return {
        render
    }
}
