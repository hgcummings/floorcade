import { Observable } from 'rxjs';
import { scan } from 'rxjs/operators';

export function init(width: number, height: number, inputEvents) {
    const input = scanInput(inputEvents);
    const state = { };
    const activity = runGame(width, height, input);

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

async function runGame(width: number, height: number, input: Observable<{ id: number; key: any; type: string; }>) {
    input.subscribe(console.log);

    const startTime = new Date().getTime();
    await new Promise(resolve => {
        const tick = () => {

            setTimeout(tick, getTickRate(startTime));
        };

        setTimeout(tick, getTickRate(startTime));
    });
}

function getTickRate(startTime) {
    return Math.max(50, 200 - ((new Date().getTime() - startTime) / 1000));
}
