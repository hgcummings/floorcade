const arena = require('./arena');
import { init as playersInit, Player } from './players';

interface State {
    arena: number[][];
    players: Player[];
    dynamite: any[];
    explosions: any[];
}

export const init = ({width, height}, input) => {
    const state: State = {
        arena: arena.init({width, height}),
        players: playersInit({width, height}),
        dynamite: [],
        explosions: []
    };

    let resolveComplete;
    const activity = new Promise((resolve, reject) => resolveComplete = resolve);

    const subscription = input.subscribe(currentInput => {
        
    });

    const startTime = new Date().getTime();

    const tick = () => {
        const deadPlayers = state.players.filter(p => !p.alive).map(p => p.id);
        if (deadPlayers.length === 4) {
            subscription.unsubscribe();
            resolveComplete();
        }

        state.players.filter(p => p.alive).forEach(player => {

        });

        state.players.filter(p => !p.alive).forEach(p => {

        });

        state.players.forEach(p => {
            //p.updatePosition();
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
