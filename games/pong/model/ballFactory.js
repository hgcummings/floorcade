const Ball = require('./ball.js');

let nextBallId = 1;

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}
function getRandomDirection() {
    const rand = Math.random();
    if (rand < 0.5) {
        return 1;
    } if (rand < 1) {
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
        var dx = getRandomDirection() * (0.7 + Math.random() * 0.5);
        const dy = getRandomDirection() * (0.7 + Math.random() * 0.5);
        if (dx === 0 && dy === 0){
            dx = 1;
        }
        return new Ball({ id: nextBallId, x: getRandomArbitrary(minX, maxX), y: getRandomArbitrary(minY, maxY), dx, dy, makeBall})
    }
};
