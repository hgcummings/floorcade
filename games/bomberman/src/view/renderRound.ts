const colours = require('./colours');
import { GameState } from '../model'


export const renderRound = ({players, arena}: GameState["round"], pixels) => {
    const [screenWidth, screenHeight] = [arena[0].length, arena.length];

    for (let y = 0; y < screenHeight; ++y) {
        for(let x = 0; x < screenWidth; ++x) {
            const colour = colours[arena[y][x]];
            printColor(y, x, colour);
        }
    }

    players.filter(p => p.alive).forEach(player => {
        const playerColour = colours[player.id] as number[];
        player.sprite.forEach((spriteRow, spritey) => {
            spriteRow.forEach((spriteMultiplier, spritex) => {
                const y = player.y + spritey;
                const x = player.x + spritex;
                const multipliedColor = playerColour.map(byte => byte * spriteMultiplier);
                printColor(y, x, multipliedColor);
            });
        });
    });

    
    function printColor(y, x, color) {
        for (let c = 0; c < 3; ++c) {
            pixels[(((y * screenWidth) + x) * 3) + c] = color[c];
        }
    }
};
