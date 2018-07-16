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
const scanInput = require('./input');
const roundFactory = require('./round');
function runGame({ width, height }, state, input) {
    return __awaiter(this, void 0, void 0, function* () {
        state.round = roundFactory.init({ width, height }, input);
        yield state.round.activity;
    });
}
exports.init = ({ width, height }, inputEvents) => {
    // const input = scanInput(inputEvents);
    const input = inputEvents;
    const state = {};
    const activity = runGame({ width, height }, state, input);
    return {
        state,
        activity
    };
};
//# sourceMappingURL=index.js.map