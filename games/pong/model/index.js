const Bat = require('./bat.js');
const Ball = require('./ball.js');
const ballFactory = require('./ballFactory.js');
const orientations = require('./orientations.js');

const walls = [
    {player: 1, name: 'LEFT'},
    {player: 2, name: 'TOP'},
    {player: 3, name: 'RIGHT'},
    {player: 4, name: 'BOTTOM'}
];


async function runGame({ width, height }, state, input) {
    const startTime = new Date().getTime();
    const getTickRate = function () {
        return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    };

    state.bats = [
        new Bat({ id: 1, x: 1, y: 15 }),
        new Bat({ id: 2, x: 30, y: 1, orientation: orientations.horizontal }),
        new Bat({ id: 3, x: 70, y: 15 }),
        new Bat({ id: 4, x: 30, y: 34, orientation: orientations.horizontal }),
    ];
    state.balls = [
        ballFactory.newBall({
            x: 10, y: 10, dx: 1, dy: 1, makeBall: ({ x, y, dx, dy, makeBall }) => {
                state.balls.push(ballFactory.newBall({ x, y, dx, dy, makeBall }));
            }
        }),
    ];
    input.subscribe(e => {
        const movement = [0, 0];
        if (e.key === 'DU' && e.type === 'down') {
            movement[1]--;
        }
        if (e.key === 'DD' && e.type === 'down') {
            movement[1]++;
        }
        if (e.key === 'DR' && e.type === 'down') {
            movement[0]++;
        }
        if (e.key === 'DL' && e.type === 'down') {
            movement[0]--;
        }
        state.bats.filter(b => b.id === e.id).forEach(b => b.move(...movement));

        if (e.type === 'down') {
            state.balls.forEach(b => b.move(state.bats, state.walls, {width, height}));
        }
    });

    function playerNumber(x) {
        return state.bats.find(bat => bat.id === x);
    }

    function loseLives() {
        state.balls.filter(b => b.x >= 0 && b.x <= width && b.y >= 0 && b.y <= width).forEach(b => {
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
            if (b.x > height) {
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
        state.balls.forEach(b => b.move(state.bats, state.walls, {width, height}));
        loseLives();
        killPlayers();
        state.balls = state.balls.filter(b => b.x >= 0 && b.x <= width && b.y >= 0 && b.y <= width);
        setTimeout(tick, getTickRate(startTime));

        if (state.balls.length === 0) {
            state.balls.push(ballFactory.newBall({
                x: 10, y: 10, dx: 1, dy: 1, makeBall: ({ x, y, dx, dy, makeBall }) => {
                    state.balls.push(ballFactory.newBall({ x, y, dx, dy, makeBall }));
                }
            }));
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
