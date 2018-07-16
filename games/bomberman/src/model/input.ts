import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { mapToAction, MoveAction, DynamiteAction } from './keymap';
export { MoveAction, DynamiteAction };

interface KeyEvent {
    id: number,
    key: string,
    type: "down" | "up"
}

export interface ActionEvent {
    playerId: number,
    action: MoveAction | DynamiteAction
}

export function mapInputEventsToActions(inputEvents): Observable<ActionEvent> {
    return inputEvents.pipe(
        map((keyEvent: KeyEvent) => {
            const action = mapToAction(keyEvent.key);
            if (!!action || keyEvent.type != "down") {
                return undefined;
            }
            return {
                playerId: keyEvent.id,
                action: action,
            }
        }),
        filter(x => !!x)
    );
}
// module.exports = (playerEvents) => 
//     playerEvents.pipe(scan((acc, event) => {
//         const next = acc.concat();
//         if (_.includes(directionBtns, event.key)) {
//             const component = 1 << (directionBtns.indexOf(event.key));
//             const i = event.id - 1;
//             let newDirection = 0;
//             if (event.type === 'down') {
//                 newDirection = acc[i] | component;
//             } else {
//                 newDirection = acc[i] & (~component);
//             }
//             if (!validDirections.hasOwnProperty(newDirection)){
//                 newDirection = event.type === 'down' ? component : 0;
//             }
//             next[i] = newDirection;
//         }
//         return next;
//     }, [0,0,0,0]));
