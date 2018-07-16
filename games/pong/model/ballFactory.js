const Ball = require('./ball.js');

let nextBallId = 1;

module.exports = {
  newBall: ({x, y, dx, dy, makeBall}) => {
    nextBallId++;
    return new Ball({id: nextBallId, x, y, dx, dy, makeBall});
  }
}
