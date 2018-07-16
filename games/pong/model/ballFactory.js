const Ball = require('./ball.js');

let nextBallId = 1;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomDirection() {
    const rand = Math.random();
    if (rand < 0.33) {
        return 1;
    } if (rand < 0.66) {
        return -1
    }
    return 0;
}

module.exports = {
    newBall: ({ x, y, dx, dy, makeBall }) => {
        nextBallId++;
        return new Ball({ id: nextBallId, x, y, dx, dy, makeBall });
    },
    newRandomBall: ({ makeBall, minX, maxX, minY, maxY }) => {
        nextBallId++;
        var dx = getRandomDirection();
        const dy = getRandomDirection();
        if (dx === 0 && dy === 0){
            dx = 1;
        }
        return new Ball({ id: nextBallId, x: getRandomArbitrary(minX, maxX), y: getRandomArbitrary(minY, maxY), dx, dy, makeBall})
    }
};
