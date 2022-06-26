const { initBoard, valueCell, winValues } = require('../constants');

class Board {
    constructor () {
        this.stateBoard = initBoard;
        this.isRepeatTurn = false;
        this.isFilledCells = false;
        this.isWinner = false;
    }

    getBoard () {
        return this.stateBoard;
    }

    checkStateBoard () {
        const cells = this.stateBoard.filter((cell) => !Object.values(valueCell).includes(cell.value));
        this.isFilledCells = !cells.length;
        return cells;
    }

    getIsRepeatTurn () {
        return this.isRepeatTurn;
    }

    getIsFilledCells () {
        return this.isFilledCells;
    }

    setCell (number, value) {
        this.isRepeatTurn = false;
        this.stateBoard.forEach((cell) => {
            if (cell.number === number) {
                !Object.values(valueCell).includes(cell.value) ? cell.value = value : this.isRepeatTurn = true;
            };
        });
    }

    checkWin (value) {
        const filledCells = this.stateBoard.filter((cell) => cell.value === value).map(({ number }) => number);
        for (const itemWin of winValues) {
            const finalize = itemWin.map((item) => filledCells.includes(item));
            this.isWinner = finalize.every((el) => el);
            if (this.isWinner) break;
        }
        return this.isWinner;
    }

    setRandomValue () {
        const notFilledCells = this.checkStateBoard();
        const randomValue = notFilledCells[Math.floor(Math.random() * notFilledCells.length)] || notFilledCells[0];
        this.setCell(randomValue.number, valueCell.tac);
        return randomValue;
    }
}

module.exports = {
    Board,
};
