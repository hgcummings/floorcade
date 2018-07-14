// const arena = import('./arena');
const palette = require('./palette.js');
const _ = require('lodash');

module.exports.init = ({width, height}) => {
  const pixels = new Array(width).fill(new Array(height).fill(palette.background));
  const render = state => {
      return (new Uint8Array(_.flattenDeep(pixels)));
  }

    return {
        render
    }
}
