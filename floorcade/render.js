const generatePallete = (initial) => {
    const palette = [];
    for (let i = 255; i > 0; i -= 12) {
        pallete.push(initial.map(c => c * i));
    }
};

const playerColours = [
    generatePallete([0,1,0]),
    generatePallete([1,1,0]),
    generatePallete([0,1,1]),
    generatePallete([1,0,1])
];