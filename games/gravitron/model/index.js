const Player = require('./player');
const Obstacle = require('./obstacle');

async function runGame({ width, height }, state, input) {
    const startTime = new Date().getTime();
    const getTickRate = function () {
        return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    };

    state.walls = [
        { y: 2, top: true },
        { y: height - 2, top: false }
    ];

    state.players = [
        new Player(12, 12, width)
    ];

    state.obstacles = [
        new Obstacle(-10, 13, 1),
        new Obstacle(-14, 15, 1),
        new Obstacle(-20, 28, 1),
    ];

    input.subscribe(e => {
        if (e.key === 'DU') {
            if (e.type === 'down') {
            }
            if (e.type === 'up') {
            }
        }
        if (e.key === 'DD') {
            if (e.type === 'down') {
            }
            if (e.type === 'up') {
            }
        }
        if (e.key === 'DR') {
            if (e.type === 'down') {
                state.players.forEach(p => p.dx = 1);
            }
            if (e.type === 'up') {
                state.players.forEach(p => p.dx = 0);
            }
        }
        if (e.key === 'DL') {
            if (e.type === 'down') {
                state.players.forEach(p => p.dx = -1);
            }
            if (e.type === 'up') {
                state.players.forEach(p => p.dx = 0);
            }
        }
    });

    const tick = () => {
        state.players.forEach(p => p.move(state.walls));
        state.obstacles.forEach(p => p.move(state.walls));
        setTimeout(tick, getTickRate(startTime));
    };

    setTimeout(tick, getTickRate(startTime));

    while (true) {
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
