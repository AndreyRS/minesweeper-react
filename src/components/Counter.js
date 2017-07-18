import React from 'react';
import PropTypes from 'prop-types';
import '../stylesheets/Counter.css';

const COUNTER_CHAR = [
  'counter0',
  'counter1',
  'counter2',
  'counter3',
  'counter4',
  'counter5',
  'counter6',
  'counter7',
  'counter8',
  'counter9',
  'counterMinus'
];

class Counter extends React.Component {

  constructor(props) {
    super(props);
    this.count = props.count;
    this.state = { display: this.generateDisplay(this.count) };
  }

  generateDisplay(count) {
    let result;
    if (count < 0) {
      if (count > -99) {
        const chars = `0${count * -1}`.substr(-2).split('').map(Number);
        result = chars.map(c => COUNTER_CHAR[c]);
        result.unshift(COUNTER_CHAR[10]);
      }
      else {
        result = [COUNTER_CHAR[10], COUNTER_CHAR[9], COUNTER_CHAR[9]];
      }
    }
    else {
      if (count < 999) {
        const chars = `00${count}`.substr(-3).split('').map(Number);
        result = chars.map(c => COUNTER_CHAR[c]);
      }
      else {
        result = [COUNTER_CHAR[9], COUNTER_CHAR[9], COUNTER_CHAR[9]];
      }
    }
    return result;
  }

  update(delta) {
    this.count = this.count + delta;
    this.setState({ display: this.generateDisplay(this.count) });
  }
  reset(count) {
    this.count = count;
    this.setState({ display: this.generateDisplay(this.count) });
  }

  render() {
    return (
      <div className="counter">
        <div className={`counterNum ${this.state.display[0]}`}></div>
        <div className={`counterNum ${this.state.display[1]}`}></div>
        <div className={`counterNum ${this.state.display[2]}`}></div>
      </div>
    );
  }
}

Counter.propTypes = { count: PropTypes.number };
Counter.defaultProps = { count: 0 };

export default Counter;