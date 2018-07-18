export interface MoveAction {
    type: "move",
    dx: number,
    dy: number
}

export interface DynamiteAction {
    type: "dynamite"
}

export const ACTIONS = {
    "MOVE_UP": { type: "move", dx: 0, dy: 1 } as MoveAction,
    "MOVE_DOWN": { type: "move", dx: 0, dy: -1 } as MoveAction,
    "MOVE_LEFT": { type: "move", dx: 1, dy: 0 } as MoveAction,
    "MOVE_RIGHT": { type: "move", dx: -1, dy: 0 } as MoveAction,
    "DYNAMITE": { type: "dynamite" } as DynamiteAction
}

export function mapToAction(inputKey: string): MoveAction | DynamiteAction | undefined {
    switch (inputKey) {
        case "DU": return ACTIONS.MOVE_UP;
        case "DR": return ACTIONS.MOVE_RIGHT;
        case "DL": return ACTIONS.MOVE_LEFT;
        case "DD": return ACTIONS.MOVE_DOWN;
        case "FL": return ACTIONS.DYNAMITE;
        case "FT": return ACTIONS.DYNAMITE;
        case "FR": return ACTIONS.DYNAMITE;
        case "FB": return ACTIONS.DYNAMITE;
    }
}
