import { init as playersInit, Player } from './players';
import { ActionEvent } from '../input';
import { Observable } from 'rxjs';
import arena = require('./arena');

interface Dynamite {
    playerId: number;
    x: number;
    y: number;
    ticksLeft: number;
}

export interface RoundState {
    arena: number[][];
    players: Player[];
    dynamite: any[];
    explosions: any[];
}

export const init = ({width, height}, input: Observable<ActionEvent>) => {
    const state: RoundState = {
        arena: arena.init({width, height}),
        players: playersInit({width, height}),
        dynamite: [],
        explosions: []
    };

    let resolveComplete;
    let rejectComplete;
    const activity = new Promise((resolve, reject) => { resolveComplete = resolve, rejectComplete = reject });

    const subscription = input.subscribe(currentInput => {
        const playerId = currentInput.playerId;
        if (playerId >= state.players.length) {
            return;
        }
        state.players[playerId].registerInput(currentInput.action);
    });

    const startTime = new Date().getTime();

    let tickCount = 0;

    const tick = () => {
        try {
            tickInner();
            setTimeout(tickInner, getTickRate(startTime));
        }
        catch (err) {
            rejectComplete(err);
        }
    }

    const tickInner = () => {
        tickCount++;
        state.players.forEach(p => p.startTick());

        const deadPlayers = state.players.filter(p => !p.alive).map(p => p.id);
        if (deadPlayers.length === state.players.length || tickCount > 10000) {
            subscription.unsubscribe();
            resolveComplete();
        }

        state.players.filter(p => p.alive).forEach(player => {

        });

        state.players.filter(p => !p.alive).forEach(p => {

        });

        state.players.forEach(p => {
            p.updatePosition();
            state.arena[p.y][p.x] = p.id;
        });
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
