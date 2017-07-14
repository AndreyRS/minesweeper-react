
const SIZE_Y = 16;
const SIZE_X = 30;
const MINES_AMOUNT = 99;

if (MINES_AMOUNT > SIZE_Y * SIZE_X) {
    throw "MINES_AMOUNT is bigger than amount of cells";
}

const cellType = {
    MINE : -1,
    OPEN_0 : 0,
    OPEN_1 : 1,
    OPEN_2 : 2,
    OPEN_3 : 3,
    OPEN_4 : 4,
    OPEN_5 : 5,
    OPEN_6 : 6,
    OPEN_7 : 7,
    OPEN_8 : 8
};

const board = [];

for (let y = 0; y < SIZE_Y; y++) {
    board[y] = [];
    for (let x = 0; x < SIZE_X; x++) {
        board[y][x] = cellType.OPEN_0;
    }
}

function getRandomPoint(max_y, max_x) {
    return {
        y : Math.floor(Math.random() * max_y),
        x : Math.floor(Math.random() * max_x)
    };
}

function setMine() {
    const point = getRandomPoint(SIZE_Y, SIZE_X);
    let success = false;
    if (board[point.y][point.x] !== cellType.MINE) {
        board[point.y][point.x] = cellType.MINE;
        success = true;
    }
    return success;
}

for (let i = 0; i < MINES_AMOUNT; i++) {
    let isSet = false;

    while (!isSet) {
        isSet = setMine();
    }
}


console.log("board:");
let result = JSON.stringify(board);
// console.log(result);
result = result.replace(/\],\[/g, "]\n[")
    .replace(/0/g, " 0").replace(/\[\[/g, "[").replace(/\]\]/g, "]");
console.log(result);

