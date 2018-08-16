const Player = require('./player');

async function runGame({ width, height }, state, input) {
    const startTime = new Date().getTime();
    const getTickRate = function () {
        return Math.min(75, 200 - ((new Date().getTime() - startTime) / 1000));
    };

    state.walls = [
        { y: 5 },
        { y: height - 5 }
    ];

    state.players = [
        new Player(12, 12)
    ];

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
    });

    const tick = () => {
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
