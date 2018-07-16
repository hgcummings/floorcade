import { Observable } from 'rxjs';
import { map, filter } from 'rxjs/operators';
import { mapToAction, MoveAction, DynamiteAction } from './keymap';
export { MoveAction, DynamiteAction };

interface KeyEvent {
    id: number,
    key: string,
    type: "down" | "up"
}

export type Action = MoveAction | DynamiteAction;

export interface ActionEvent {
    playerId: number,
    action: Action
}

export function mapInputEventsToActions(inputEvents): Observable<ActionEvent> {
    return inputEvents.pipe(
        map((keyEvent: KeyEvent) => {
            const action = mapToAction(keyEvent.key);
            if (!action || keyEvent.type != "down") {
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