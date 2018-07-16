const Bat = require('./bat.js');
const Ball = require('./ball.js');
const ballFactory = require('./ballFactory.js');
const orientations = require('./orientations.js');

const walls = [
    { player: 1, name: 'LEFT' },
    { player: 2, name: 'TOP' },
    { player: 3, name: 'RIGHT' },
    { player: 4, name: 'BOTTOM' }
];

async function runGame({ width, height }, state, input) {
    const startTime = new Date().getTime();
    const getTickRate = function () {
        return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    };

    const randomBall = () => ballFactory.newRandomBall({
        minX: Math.floor(width / 2) - 5,
        maxX: Math.floor(width / 2) + 5,
        minY: Math.floor(height / 2) - 5,
        maxY: Math.floor(height / 2) + 5,
        makeBall: ({ x, y, dx, dy, makeBall }) => {
            state.balls.push(ballFactory.newBall({ x, y, dx, dy, makeBall }));
        }
    });

    state.bats = [
        new Bat({ id: 1, x: 1, y: 15, wall: walls.find(w => w.player === 1) }),
        new Bat({ id: 2, x: 30, y: 1, orientation: orientations.horizontal, wall: walls.find(w => w.player === 2) }),
        new Bat({ id: 3, x: 70, y: 15, wall: walls.find(w => w.player === 3) }),
        new Bat({ id: 4, x: 30, y: 34, orientation: orientations.horizontal, wall: walls.find(w => w.player === 4) }),
    ];
    state.balls = [randomBall()];
    input.subscribe(e => {
        const movement = [0, 0];
        if (e.key === 'DU') {
            if (e.type === 'down') {
                movement[1]--;
            }
            if (e.type === 'up') {
                movement[1]++;
            }
        }
        if (e.key === 'DD') {
            if (e.type === 'down') {
                movement[1]++;
            }
            if (e.type === 'up') {
                movement[1]--;
            }
        }
        if (e.key === 'DR') {
            if (e.type === 'down') {
                movement[0]++;
            }
            if (e.type === 'up') {
                movement[0]--;
            }
        }
        if (e.key === 'DL') {
            if (e.type === 'down') {
                movement[0]--;
            }
            if (e.type === 'up') {
                movement[0]++;
            }
        }
        state.bats.filter(b => b.id === e.id).forEach(b => b.changeVelocity(...movement.map(m => m * 2)));

        if (e.type === 'down') {
            state.balls.forEach(b => b.move(state.bats, state.walls, { width, height }));
        }
    });

    function playerNumber(x) {
        return state.bats.find(bat => bat.id === x);
    }

    function loseLives() {
        state.balls.forEach(b => {
            const playersToLoseLife = [];
            if (b.x < 0) {
                playersToLoseLife.push(playerNumber(1));
            }
            if (b.x > width) {
                playersToLoseLife.push(playerNumber(3));
            }
            if (b.y < 0) {
                playersToLoseLife.push(playerNumber(2));
            }
            if (b.y > height) {
                playersToLoseLife.push(playerNumber(4));
            }
            playersToLoseLife.filter(x => x).forEach(p => p.loseLife());
        });
    }

    function killPlayers() {
        const deadPlayers = state.bats.filter(b => !b.isAlive());
        deadPlayers.forEach(dp => {
            state.walls.push(walls.find(w => w.player === dp.id));
        });
        state.bats = state.bats.filter(b => b.isAlive());
    }

    const tick = () => {
        state.bats.forEach(b => b.move({ width, height }));
        state.balls.forEach(b => b.move(state.bats, state.walls, { width, height }));
        loseLives();
        killPlayers();

        // Remove OOB balls
        state.balls = state.balls.filter(b => b.x >= 0 && b.x <= width && b.y >= 0 && b.y <= height);
        setTimeout(tick, getTickRate(startTime));

        if (state.balls.length === 0) {
            state.balls.push(randomBall());
        }

        if (state.bats.length === 0) {
            process.exit(0);
        }
    };

    setTimeout(tick, getTickRate(startTime));


    while (state.bats.filter(b => b.isAlive()).length > 0 && state.balls.length > 0) {
        await new Promise(() => {
        });
    }
}

module.exports.init = ({ width, height }, inputEvents) => {
    // const input = scanInput(inputEvents);
    const state = { walls: [] };
    const activity = runGame({ width, height }, state, inputEvents);

    return {
        state,
        activity,
    };
};
