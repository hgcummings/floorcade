import { Observable } from 'rxjs';
import * as player from 'node-wav-player';

export interface State {
    player: { x: number, y: number, score: number, alive: boolean };
    pipes: { x: number, topY: number, bottomY: number }[];
}

export function init(width: number, height: number, inputEvents: Observable<{ playerId: number }>) {
    const state = { player: { x: 1, y: 10, score: 0, alive: true }, pipes: [] };
    const activity = runGame(width, height, state, inputEvents);

    return {
        state,
        activity
    };
}

async function runGame(width: number, height: number, state: State, input: Observable<{ playerId: number }>) {
    const pipeGap = 4;
    const pipeDistance = height / 2;

    await new Promise(resolve => {
        const startTime = new Date().getTime();
        let tickCount = 0;
        const subscription = input.subscribe(currentInput => {
            if (state.player.y > 0) {
                player.play({ path: './assets/flap.wav' });
                state.player.y -= 1;
            }
        });

        const tick = () => {
            tickCount++;

            if (state.player.y < height - 2) {
                state.player.y += 1;
            } else {
                player.play({ path: './assets/hit.wav' });
                state.player.alive = false;
            }

            state.pipes.forEach(pipe => {
                pipe.x -= 1;

                if (pipe.x < 0) {
                    const midpoint = Math.round(Math.random() * (height - 1));
                    pipe.x = width - 1;
                    pipe.bottomY = midpoint - pipeGap / 2;
                    pipe.topY = midpoint + pipeGap / 2;
                }

                if (state.player.x === pipe.x) {
                    if (state.player.y < pipe.bottomY || state.player.y > pipe.topY) {
                        // Hit the pipe
                        player.play({ path: './assets/hit.wav' });
                        state.player.alive = false;
                    } else {
                        // Through the pipe
                        player.play({ path: './assets/score.wav' });
                        state.player.score++;
                    }
                }
            });

            if (tickCount % pipeDistance === 0 && state.pipes.length < Math.floor(width / pipeDistance)) {
                const midpoint = Math.round(Math.random() * (height - 1));
                state.pipes.push({
                    x: width - 1,
                    bottomY: midpoint - pipeGap / 2,
                    topY: midpoint + pipeGap / 2,
                });
            }

            if (!state.player.alive) {
                player.play({ path: './assets/gameover.wav' });
                subscription.unsubscribe();
                resolve();
                return;
            }

            setTimeout(tick, getTickRate(startTime));
        };

        setTimeout(tick, getTickRate(startTime));
    });
}

function getTickRate(startTime) {
    return Math.max(50, 200 - ((new Date().getTime() - startTime) / 1000));
}
