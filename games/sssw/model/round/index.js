const arena = require('./arena');
const players = require('./players');

const placeScores = [0, 1, 2, 5];

module.exports.init = ({width, height}, input) => {
    const state = {
        arena: arena.init({width, height}),
        players: players.init({width, height})
    };

    let resolveComplete;
    const activity = new Promise((resolve, reject) => resolveComplete = resolve);

    const subscription = input.subscribe(currentInput => {
        state.players.forEach((player, i) => {
            player.updateDirection(currentInput[i]);
        });
    });

    const startTime = new Date().getTime();

    const tick = () => {
        const collisions = [];
        const deadPlayers = state.players.filter(p => !p.alive).map(p => p.id);
        if (deadPlayers.length === 4) {
            subscription.unsubscribe();
            resolveComplete();
        }
        state.players.filter(p => p.alive).forEach(player => {
            collisions.push(...player.checkCollisions(state));
        });

        state.players.filter(p => !p.alive).forEach(p => {
            if (!deadPlayers.includes(p.id)) {
                // Player died this turn
                p.score.place += placeScores[deadPlayers.length];
            }
        });

        collisions.forEach(collision => {
            const collidedWithActivePlayer = state.players.find(p => p.id === collision && p.alive);
            if (collidedWithActivePlayer) {
                collidedWithActivePlayer.score.kills += 1;
            }
        });

        state.players.forEach(p => {
            p.updatePosition();
            state.arena[p.y][p.x] = p.id;
        });

        setTimeout(tick, getTickRate(startTime));
    };

    setTimeout(tick, getTickRate(startTime));

    return {
        activity,
        ...state
    }
}

const getTickRate = function(startTime) {
    return Math.max(50, 200 - ((new Date().getTime() - startTime) / 1000));
}
