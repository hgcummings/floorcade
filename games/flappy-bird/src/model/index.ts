import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export interface State {
    playerY: number;
}

export function init(width: number, height: number, inputEvents) {
    const input = scanInput(inputEvents);
    const state = { playerY: 10 };
    const activity = runGame(width, height, state, input);

    return {
        state,
        activity
    };
}

const directionBtns = ['DU', 'DR', 'DD', 'DL'];

function scanInput(playerEvents) {
    return playerEvents.pipe(scan((acc, event: any) => {
        const next = acc.concat();
        if (directionBtns.includes(event.key)) {
            const component = 1 << (directionBtns.indexOf(event.key));
            const i = event.id - 1;
            let newDirection = 0;
            if (event.type === 'down') {
                newDirection = acc[i] | component;
            } else {
                newDirection = acc[i] & (~component);
            }
            next[i] = newDirection;
        }
        return next;
    }, [0, 0, 0, 0]));
}

async function runGame(width: number, height: number, state: State, input: Observable<{ playerId: number }>) {
    const dead = false;
    const subscription = input.subscribe(currentInput => {
        if (state.playerY > 0) {
            state.playerY -= 1;
        }
    });

    const startTime = new Date().getTime();
    await new Promise(resolve => {
        if (dead) {
            subscription.unsubscribe();
            resolve();
        }

        const tick = () => {
            if (state.playerY < height - 2) {
                state.playerY += 1;
            }
            setTimeout(tick, getTickRate(startTime));
        };

        setTimeout(tick, getTickRate(startTime));
    });
}

function getTickRate(startTime) {
    return Math.max(50, 200 - ((new Date().getTime() - startTime) / 1000));
}
