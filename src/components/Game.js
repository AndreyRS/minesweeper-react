import React from 'react';
import ReactDOM from 'react-dom';
import Board from '../components/Board';
import Counter from '../components/Counter';
import '../stylesheets/Game.css'

const BOARD_CONFIG = Object.freeze({
  EASY: { x: 9, y: 9, mines: 10 },
  MEDIUM: { x: 16, y: 16, mines: 40 },
  HARD: { x: 30, y: 16, mines: 99 }
});

class Game extends React.Component {
  constructor() {
    super();

    this.configuration = BOARD_CONFIG.MEDIUM;

    this.startGame = this.startGame.bind(this);
    this.stopGame = this.stopGame.bind(this);

    this.updateMines = this.updateMines.bind(this);
    this.updateTimer = this.updateTimer.bind(this);
  }

  startGame() {
    this.updateTimer();
    this.timerFunc = setInterval(this.updateTimer, 1000);
  }
  stopGame() {
    clearInterval(this.timerFunc);
  }

  updateMines(delta) {
    this.mineCounter.update(delta);
  }
  updateTimer() {
    this.timeCounter.update(1);
  }

  resetCounters() {
    clearInterval(this.timerFunc)
    this.mineCounter.reset(this.configuration.mines);
    this.timeCounter.reset(0);
  }

  createNewGame(config) {
    this.configuration = config;
    this.resetCounters();
    this.unmountBoard();
    this.mountBoard()
  }

  mountBoard() {
    ReactDOM.render((
      <Board configuration={this.configuration} startGame={this.startGame}
        stopGame={this.stopGame} updateMines={this.updateMines} />
    ), document.getElementById('boardWrapper'));
  }
  unmountBoard() {
    ReactDOM.unmountComponentAtNode(document.getElementById('boardWrapper'));
  }

  componentDidMount() {
    this.mountBoard();
  }

  render() {
    return (
      <div className="game">

        <table>
          <tbody>
            <tr>
              <td>
                <Counter ref={mc => this.mineCounter = mc}
                  count={this.configuration.mines} />
              </td>
              <td>
                <StartButton type="Easy"
                  start={() => this.createNewGame(BOARD_CONFIG.EASY)} />
              </td>
              <td>
                <StartButton type="Medium"
                  start={() => this.createNewGame(BOARD_CONFIG.MEDIUM)} />
              </td>
              <td>
                <StartButton type="Hard"
                  start={() => this.createNewGame(BOARD_CONFIG.HARD)} />
              </td>
              <td>
                <Counter ref={tc => this.timeCounter = tc} />
              </td>
            </tr>
            <tr>
              <td colSpan="5">
                <div className="boardWrapper" id="boardWrapper"></div>
              </td>
            </tr>
          </tbody>
        </table>

      </div>
    );
  }
}

const StartButton = (props) => (
  <div className="playBtn" onClick={props.start}>
    {props.type}
  </div>
);

export default Game;