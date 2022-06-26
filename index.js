const termkit = require('terminal-kit');
const term = termkit.terminal;

const { valueCell } = require('./constants');
const { Board } = require('./service/board');
const srvBoard = new Board();

term.grabInput({});

const drawTable = (inputBoard) => {
    const tableProps = {
        fit: true,
        hasBorder: true,
        contentHasMarkup: true,
        borderChars: 'lightRounded',
        textAttr: { bgColor: 'default' },
        width: 100,
    };

    const tableRows = [
        inputBoard.slice(0, 3).map(({ value, number }) => `${value} cell #${number}`),
        inputBoard.slice(3, 6).map(({ value, number }) => `${value} cell #${number}`),
        inputBoard.slice(6, 9).map(({ value, number }) => `${value} cell #${number}`),
    ];

    term.table([...tableRows], tableProps);
};

const checkStateGame = (player) => {
    const isWinner = srvBoard.checkWin(player);
    const text = player === valueCell.tic ? 'WINNER' : 'LOOSER';
    if (isWinner) {
        term.bold.yellow(`YOU ${text}. GAME OVER \n`);
        term.processExit();
    }
    const isFilledCells = srvBoard.getIsFilledCells();
    if (isFilledCells) {
        term.bold.cyan('GAME OVER. All fields is filled \n');
        term.processExit();
    }
};

const inputNumber = async () => {
    term.green( 'Enter NUMBER (1-9):\n> ' ) ;
    const input = await term.inputField().promise;
    term.green( "\nYour input is '%s'\n" , input);
    srvBoard.setCell(parseInt(input), valueCell.tic);
    const isRepeatTurn = srvBoard.getIsRepeatTurn();
    if (parseInt(input) < 1 || parseInt(input) > 9) {
        term.bold.cyan('Please correct. Input NUMBER (1-9) again \n');
        await inputNumber();
    }
    if (isRepeatTurn) {
        term.bold.cyan('This cell is filled. Input NUMBER (1-9) again \n');
        await inputNumber();
    }
};

const initGame = async () => {
    const inputBoard = srvBoard.getBoard();
    drawTable(inputBoard);
    await inputNumber();
    checkStateGame(valueCell.tic);
    const { number } = srvBoard.setRandomValue();
    term.red( "\nIzya choose is '%s'\n" , number);
    checkStateGame(valueCell.tac);
    await initGame();
};

term.on('key', (key) => {
    switch (key) {
      case 'CTRL_C':
        this.exit(0);
        break;
      case 'q':
        this.exit(0);
        break;
    }
});

initGame();
