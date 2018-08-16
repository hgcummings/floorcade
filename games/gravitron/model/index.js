const Player = require('./player');
const Obstacle = require('./obstacle');

async function runGame({ width, height }, state, input) {

    let frame = 0;
    const wallBezel = 2;

    const startTime = new Date().getTime();
    const getTickRate = function () {
        return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    };

    state.walls = [
        { y: wallBezel, top: true },
        { y: height - wallBezel, top: false }
    ];

    state.players = [
        new Player({ id: 1, x: 12, y: 10, screenWidth: width }),
        new Player({ id: 2, x: 24, y: 20, screenWidth: width }),
        new Player({ id: 3, x: 40, y: 30, screenWidth: width }),
        new Player({ id: 4, x: 56, y: 23, screenWidth: width }),
    ];

    state.obstacles = [
        new Obstacle({ x: -10, y: 13, dx: 1 }),
        new Obstacle({ x: -14, y: 15, dx: 1 }),
        new Obstacle({ x: -20, y: 28, dx: 1 }),
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
        if (e.key === 'DR' || e.key === 'RS') {
            if (e.type === 'down') {
                state.players.filter(p => p.id === e.id).forEach(p => p.dx = 1);
            }
            if (e.type === 'up') {
                state.players.filter(p => p.id === e.id).forEach(p => p.dx = 0);
            }
        }
        if (e.key === 'DL' || e.key === 'LS') {
            if (e.type === 'down') {
                state.players.filter(p => p.id === e.id).forEach(p => p.dx = -1);
            }
            if (e.type === 'up') {
                state.players.filter(p => p.id === e.id).forEach(p => p.dx = 0);
            }
        }
    });

    function makeRandomObstacle() {
        const x = (Math.random() - 0.5) > 0 ? -1 : width + 1;
        const y = Math.floor((Math.random() * (height - wallBezel - wallBezel)) + wallBezel);
        const dx = x < 0 ? 1 : -1;
        const dy = (Math.random()) > 0.5 ? (Math.random() > 0.5) ? -1 : 1 : 0;
        state.obstacles.push(new Obstacle({ x, y, dx, dy, width }));
    }

    const tick = () => {
        frame++;
        frame = frame % 10;

        if (frame === 1) {
            makeRandomObstacle();
        }

        state.players.forEach(p => p.move(state.walls));
        state.obstacles.forEach(p => p.move(state.walls));
        let deadPlayer = state.players.find(p => p.collidesWithAny(state.obstacles));
        if (deadPlayer) {
            state.players = state.players.filter(p => p.id !== deadPlayer.id);
        }

        if (state.players.length === 0) {
            throw new Error();
        }

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
