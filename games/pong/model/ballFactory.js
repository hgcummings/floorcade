const Ball = require('./ball.js');

let nextBallId = 1;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomDirection() {
    return Math.random() > 0.5 ?  -1 : 1;
}

module.exports = {
    newBall: ({ x, y, dx, dy, makeBall }) => {
        nextBallId++;
        return new Ball({ id: nextBallId, x, y, dx, dy, makeBall });
    },
    newRandomBall: ({ makeBall, minX, maxX, minY, maxY }) => {
        nextBallId++;
        return new Ball({ id: nextBallId, x: getRandomArbitrary(minX, maxX), y: getRandomArbitrary(minY, maxY), dx: getRandomDirection(), dy: getRandomDirection(), makeBall})
    }
};
