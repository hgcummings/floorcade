export const EMPTY = 0;
export const WALL = 99;

export const init = ({width, height}) => {
    const cells: number[][] = [];
    for (let i = 0; i < height; i++) {
        const row: number[] = new Array(width).fill(EMPTY);
        cells.push(row);
    }
    return cells;
}