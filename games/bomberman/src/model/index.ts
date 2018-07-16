import { mapInputEventsToActions } from './input';
import { init as initRound, RoundState } from './round';

async function runGame({width, height}, state, input) {
    state.round = initRound({width, height}, input);
    await state.round.activity;
}

export interface GameState {
    round: RoundState; 
}

export const init = ({width, height}, inputEvents): { state: GameState, activity: Promise<any> } => {
    const input = mapInputEventsToActions(inputEvents);
    const state = {} as any;
    const activity = runGame({width, height}, state, input);

    return {
        state,
        activity
    };
}
