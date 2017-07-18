import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/Cell.css';

const BTN_TYPE = Object.freeze({
  LEFT: 0,
  MIDDLE: 1,
  RIGHT: 2
});

const CELL_DISPLAY = Object.freeze({
  FLAG: 'flag', MINE_EXPLODE: 'mine-red', MINE: 'mine',
  OPEN0: 'open0', OPEN1: 'open1', OPEN2: 'open2',
  OPEN3: 'open3', OPEN4: 'open4', OPEN5: 'open5',
  OPEN6: 'open6', OPEN7: 'open7', OPEN8: 'open8'
});

const GAME_STATUS = Object.freeze({
  NOT_STARTED: 0, STARTED: 1, WON: 2, LOST: 3
});

const ACTION_TYPE = Object.freeze({
  OPEN_EMPTY: 0, OPEN_MINE: 1, MARKED: 2, UNMARKED: 3
});

class Cell extends React.Component {

  constructor(props) {
    super(props);

    this.open = false;
    this.marked = false;
    this.value = this.getDisplayValue(this.props.value);

    this.state = { display: '' };

    this.mouseUp = this.mouseUp.bind(this);
    this.mouseDown = this.mouseDown.bind(this);
    this.mouseLeave = this.mouseLeave.bind(this);
    this.mouseEnter = this.mouseEnter.bind(this);
  }
  getDisplayValue(value) {
    return (value > -1) ? `open${value}` : CELL_DISPLAY.MINE;
  }

  openCell(fromBoard) {
    this.open = true;
    let valueToSet = this.value;
    if (valueToSet === CELL_DISPLAY.MINE) {
      if (fromBoard) {
        if (this.props.getStatus() === GAME_STATUS.WON) {
          if (!this.marked) {
            this.props.updateStatus(ACTION_TYPE.MARKED);
          }
          this.marked = true;
          valueToSet = CELL_DISPLAY.FLAG;
        }
        else if (this.props.getStatus() === GAME_STATUS.LOST) {
          valueToSet = this.marked ? CELL_DISPLAY.FLAG : CELL_DISPLAY.MINE;
        }
      }
      else {
        valueToSet = CELL_DISPLAY.MINE_EXPLODE;
        this.props.updateStatus(ACTION_TYPE.OPEN_MINE, this.props.id);
      }
    }
    else {
      this.props.updateStatus(ACTION_TYPE.OPEN_EMPTY, this.props.id);
      if (valueToSet === CELL_DISPLAY.OPEN0 && !fromBoard) {
        this.props.openNeighbors(this.props.id);
      }
    }
    this.setState({ display: valueToSet });
  }

  // EVENTS

  mouseUp(e) {
    if (e.button === BTN_TYPE.LEFT && !this.open && !this.marked) {
      this.openCell(false);
    }
  }
  mouseDown(e) {
    e.preventDefault();
    if (e.button === BTN_TYPE.LEFT && !this.open && !this.marked) {
      this.setState({ display: CELL_DISPLAY.OPEN0 });
    }
    else if (e.button === BTN_TYPE.RIGHT && !this.open) {
      this.marked = !this.marked;
      this.props.updateStatus(this.marked ? ACTION_TYPE.MARKED : ACTION_TYPE.UNMARKED);
      this.setState({ display: this.marked ? CELL_DISPLAY.FLAG : '' });
    }
  }
  mouseLeave(e) {
    if (this.state.display !== '' && !this.open && !this.marked) {
      this.setState({ display: '' });
    }
  }
  mouseEnter(e) {
    // left mouse button === 1
    if (e.buttons === 1 && !this.open && !this.marked) {
      this.setState({ display: CELL_DISPLAY.OPEN0 });
    }
  }


  render() {
    return (
      <div className={`cell ${this.state.display}`}
        onMouseUp={this.mouseUp}
        onMouseDown={this.mouseDown}
        onMouseLeave={this.mouseLeave}
        onMouseEnter={this.mouseEnter}
        onContextMenu={e => e.preventDefault()}>
      </div>
    );
  }
}

Cell.propTypes = {
  id: PropTypes.number.isRequired,
  value: PropTypes.number,
  openNeighbors: PropTypes.func.isRequired,
  getStatus: PropTypes.func.isRequired,
  updateStatus: PropTypes.func.isRequired
};

Cell.defaultProps = {
  value: 0
};

export default Cell;