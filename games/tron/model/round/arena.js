const WALL = module.exports.WALL = 99;

module.exports.init = ({width, height}) => {
    const cells = [];
    cells.push(new Array(width).fill(WALL));
    for (let i = 1; i < height - 1; ++i) {
        const row = new Array(width).fill(0);
        row[0] = WALL;
        row[width - 1] = WALL;
        cells.push(row);
    }
    cells.push(new Array(width).fill(WALL));
    return cells;
}
