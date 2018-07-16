"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = (playersFromRound, playerTotals) => {
    const players = playersFromRound.map((p, i) => (Object.assign({ id: p.id, total: playerTotals[i] }, p.score)));
    const activity = countScores(players);
    return {
        players,
        activity
    };
};
function countScores(players) {
    return __awaiter(this, void 0, void 0, function* () {
        yield sleep(1000);
        while (players.some(p => p.kills > 0 || p.place > 0)) {
            players.forEach(p => {
                if (p.kills > 0) {
                    p.kills -= 1;
                    p.total += 1;
                }
                if (p.place > 0) {
                    p.place -= 1;
                    p.total += 1;
                }
            });
            yield sleep(500);
        }
        yield sleep(1500);
        return players.map(p => p.total);
    });
}
const sleep = timeout => new Promise((resolve, reject) => {
    setTimeout(() => resolve(), timeout);
});
//# sourceMappingURL=scores.js.map