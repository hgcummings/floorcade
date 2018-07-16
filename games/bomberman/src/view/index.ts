import { renderRound } from './renderRound';
import { GameState } from '../model'

export const init = ({width, height}) => {
    const pixels = new Uint8Array(width * height * 3);

    const render = (state: GameState) => {
        if (state.round) {
            renderRound(state.round, pixels);
        }
        return pixels;
    }

    return {
        render
    }
}
