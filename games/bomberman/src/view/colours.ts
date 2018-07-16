const { WALL } = require('../model/round/arena'); 
const colours = [
    [0,0,0],
    [255, 128, 0],
    [255, 0, 255],
    [0, 255, 255],
    [0, 255, 0]
];

colours[WALL] = [255, 255, 255];

export = colours;
