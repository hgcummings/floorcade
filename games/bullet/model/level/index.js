const players = require('./players');
const bullet = require('./bullet');
const log = require('../../log');

module.exports.init = ({width, height}, input) => {
    const state = {
        players: players.init({width, height}),
        bullets: []
    };

    let resolveComplete;
    const activity = new Promise((resolve, reject) => resolveComplete = resolve);

    const subscription = input.subscribe(currentInput => {
        state.players.forEach((player, i) => {
            player.updateDirection(currentInput[i]);
        });
    });

    const gameTime = new Date().getTime();
    const delta = new Date().getTime();

    const tick = () => {
        const timeSinceStart = new Date().getTime() - gameTime;
        const collisions = [];
        const deadPlayers = state.players.filter(p => !p.alive).map(p => p.id);

        const generateBullet = Math.random() > 0.8;
        if(generateBullet){
            state.bullets.push(bullet.init(timeSinceStart));
        }

        if (deadPlayers.length === 1) {
            subscription.unsubscribe();
            resolveComplete();
        }

        state.players.filter(p => p.alive).forEach(player => {
            player.checkCollisions(state);
            player.updateScore(timeSinceStart);
        });

        state.players.forEach(p => {
            p.updatePosition();
        });

        state.bullets.forEach(b => {
            b.updatePosition();
            if(b.x < 0){
                var index = state.bullets.indexOf(b);
                state.bullets.splice(index,1);
            }
        })

        setTimeout(tick, getTickRate(delta));
    };

    setTimeout(tick, getTickRate(delta));

    return {
        activity,
        ...state
    }
}

const getTickRate = function(delta) {
    return 30;
}
