import React from 'react';
import PropTypes from 'prop-types';
import Cell from '../components/Cell';
import '../stylesheets/Board.css';

const CELL_VALUE = Object.freeze({
  MINE: -1, OPEN0: 0, OPEN1: 1, OPEN2: 2, OPEN3: 3,
  OPEN4: 4, OPEN5: 5, OPEN6: 6, OPEN7: 7, OPEN8: 8
});

const GAME_STATUS = Object.freeze({
  NOT_STARTED: 0, STARTED: 1, WON: 2, LOST: 3
});

const ACTION_TYPE = Object.freeze({
  OPEN_EMPTY: 0, OPEN_MINE: 1, MARKED: 2, UNMARKED: 3
});

class Board extends React.Component {

  constructor(props) {
    super(props);

    this.cells = [];
    this.open = 0;
    this.gameStatus = GAME_STATUS.NOT_STARTED;

    this.params = this.props.configuration;
    this.cellAmount = this.params.x * this.params.y;

    this.board = this.createBoard();
    this.setMines();

    this.openNeighbors = this.openNeighbors.bind(this);
    this.updateGameStatus = this.updateGameStatus.bind(this);
    this.getGameStatus = this.getGameStatus.bind(this);
  }

  // SETUP

  setRandomMine(excluded) {
    const index = Math.floor(Math.random() * this.cellAmount);
    let iMine = -1;
    if (!excluded.includes(index) && this.board[index] !== CELL_VALUE.MINE) {
      iMine = index;
      this.board[iMine] = CELL_VALUE.MINE;
    }
    return iMine;
  }
  getNeighbors(index) {
    let neighbors;
    const isTop = Math.floor(index / this.params.x) === this.params.y - 1;
    const isBottom = Math.floor(index / this.params.x) === 0;
    const isLeft = index % this.params.x === 0;
    const isRight = (index + 1) % this.params.x === 0;

    if (isTop) {
      if (isLeft) {
        neighbors = [
          index - this.params.x, index - this.params.x + 1,
          index + 1
        ];
      }
      else if (isRight) {
        neighbors = [
          index - this.params.x - 1, index - this.params.x,
          index - 1
        ];
      }
      else {
        neighbors = [
          index - this.params.x - 1, index - this.params.x, index - this.params.x + 1,
          index - 1, index + 1
        ];
      }
    }
    else if (isBottom) {
      if (isLeft) {
        neighbors = [
          index + 1,
          index + this.params.x, index + this.params.x + 1
        ];
      }
      else if (isRight) {
        neighbors = [
          index - 1,
          index + this.params.x - 1, index + this.params.x
        ];
      }
      else {
        neighbors = [
          index - 1, index + 1,
          index + this.params.x - 1, index + this.params.x, index + this.params.x + 1
        ];
      }
    }
    else {
      if (isLeft) {
        neighbors = [
          index - this.params.x, index - this.params.x + 1,
          index + 1,
          index + this.params.x, index + this.params.x + 1
        ];
      }
      else if (isRight) {
        neighbors = [
          index - this.params.x - 1, index - this.params.x,
          index - 1,
          index + this.params.x - 1, index + this.params.x
        ];
      }
      else {
        neighbors = [
          index - this.params.x - 1, index - this.params.x, index - this.params.x + 1,
          index - 1, index + 1,
          index + this.params.x - 1, index + this.params.x, index + this.params.x + 1
        ];
      }
    }
    return neighbors;
  }
  setMines(startCell) {
    const mines = [];

    for (let i = 0; i < this.params.mines; i++) {
      let iMine = -1;
      while (iMine < 0) {
        iMine = this.setRandomMine([startCell]);
      }
      mines.push(iMine);
    }
    for (const iMine of mines) {
      const neighbors = this.getNeighbors(iMine);
      for (const iNeighbor of neighbors) {
        if (this.board[iNeighbor] !== CELL_VALUE.MINE) {
          this.board[iNeighbor]++;
        }
      }
    }

    return mines;
  }
  createBoard() {
    const board = [];
    for (let i = 0; i < this.cellAmount; i++) {
      board.push(CELL_VALUE.OPEN0);
    }
    return board;
  }

  // CONTROLS

  getGameStatus() {
    return this.gameStatus;
  }
  updateGameStatus(actionType, index) {
    switch (actionType) {
      case ACTION_TYPE.OPEN_EMPTY:
        this.open++;
        if (this.gameStatus === GAME_STATUS.NOT_STARTED) {
          this.gameStatus = GAME_STATUS.STARTED;
          this.props.startGame();
        }
        if (this.gameStatus !== GAME_STATUS.LOST) {
          const cellsLeft = this.cellAmount - this.open;
          if (cellsLeft === this.params.mines) {
            this.endGame(true);
          }
        }
        break;
      case ACTION_TYPE.OPEN_MINE:
        this.endGame(false);
        break;
      case ACTION_TYPE.MARKED:
        this.props.updateMines(-1);
        break;
      case ACTION_TYPE.UNMARKED:
        this.props.updateMines(1);
        break;
    }
  }
  endGame(won) {
    this.gameStatus = won ? GAME_STATUS.WON : GAME_STATUS.LOST;
    this.openCells(this.cells);
    this.props.stopGame();
    console.log(won ? "you won!" : "you lost!");
  }
  openCells(listOfCells) {
    for (let cell of listOfCells) {
      if (!cell.open) {
        cell.openCell(true);
      }
    }
  }
  openNeighbors(index) {
    let toCheck = this.getNeighbors(index);
    let toOpen = toCheck.slice();
    while (toCheck.length > 0) {
      const cell = toCheck.pop();
      if (this.cells[cell].props.value === 0) {
        const newNeighbors = this.getNeighbors(cell)
          .filter(n => !toOpen.includes(n) && !toCheck.includes(n) && n !== index);
        toCheck = toCheck.concat(newNeighbors);
        toOpen = toOpen.concat(newNeighbors);
      }
    }
    this.openCells(this.cells.filter((c, i) => toOpen.includes(i)));
  }


  render() {
    return (
      <div className="board"
        style={{ width: `${16 * this.params.x}px`, height: `${16 * this.params.y}px` }}>
        {
          this.board.map((cell, index) => (
            <Cell key={index} id={index} ref={c => this.cells.push(c)}
              value={cell} openNeighbors={this.openNeighbors}
              getGameStatus={this.getGameStatus} updateGameStatus={this.updateGameStatus} />
          ))
        }
      </div>
    );
  }
}

Board.propTypes = {
  configuration: PropTypes.object,
  startGame: PropTypes.func.isRequired,
  stopGame: PropTypes.func.isRequired,
  updateMines: PropTypes.func.isRequired
};

Board.defaultProps = {
  configuration: { x: 9, y: 9, mines: 10 }
};

export default Board;