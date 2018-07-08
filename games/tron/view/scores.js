const { fonts, renderPixels } = require('js-pixel-fonts');
const colours = require('./colours');

const FONT = fonts.slumbers;
const SPACING = 3;
const TEXT_COLOUR = [255, 255, 255];

const rowLabels = {
    kills: { pixels: renderPixels('KILLS', FONT), colour: TEXT_COLOUR },
    place: { pixels: renderPixels('PLACE', FONT), colour: TEXT_COLOUR },
    total: { pixels: renderPixels('TOTAL', FONT), colour: TEXT_COLOUR }
};

const playerLabels = [1,2,3,4].map(p => ({
    pixels: renderPixels(`P${p}`, FONT),
    colour: colours[p]
}));

const EMPTY = {
    pixels: [[]],
    colour: [0, 0, 0]
}

module.exports.render = ({width, height}, {players}, pixels) => {
    const table = [
        [EMPTY, ...playerLabels],
        ...(['kills', 'place', 'total'].map(row => [
            rowLabels[row],
            ...(players.map(p => ({
                pixels: renderPixels(p[row].toString(), FONT),
                colour: colours[p.id]
            })))
        ]))
    ];

    const columnWidths = [];
    const rowHeights = [];
    for (row of table) {
        let rowHeight = 0;
        for (let i = 0; i < row.length; ++i) {
            const cell = row[i];
            rowHeight = Math.max(rowHeight, cell.pixels.length);
            const cellWidth = cell.pixels[0].length;
            if (columnWidths[i]) {
                columnWidths[i] = Math.max(columnWidths[i], cellWidth);
            } else {
                columnWidths[i] = cellWidth;
            }
        }
        rowHeights.push(rowHeight);
    }

    const tableWidth = totalWithSpacing(columnWidths);
    const tableHeight = totalWithSpacing(rowHeights);

    const top = Math.floor((height - tableHeight) / 2);
    const left = Math.floor((width - tableWidth) / 2);
    let topOffset = top;
    let leftOffset = left;

    pixels.fill(0);
    for (let r = 0; r < table.length; ++r) {
        const row = table[r];
        for (let c = 0; c < row.length; ++c) {
            const cell = row[c];
            for (let y = 0; y < cell.pixels.length; ++y) {
                const line = cell.pixels[y];
                for (let x = 0; x < line.length; ++x) {
                    if (cell.pixels[y][x]) {
                        for (let c = 0; c < 3; ++c) {
                            pixels[((((y + topOffset) * width) + x + leftOffset) * 3) + c] =
                                cell.colour[c];
                        }
                    }
                }
            }
            leftOffset += columnWidths[c] + SPACING;
        }
        topOffset += rowHeights[r] + SPACING;
        leftOffset = left;
    }
};

const totalWithSpacing = cellDimensions =>
    cellDimensions.reduce((acc, cur) => acc + cur, (cellDimensions.length - 1) * SPACING);
