import React from 'react';
import '../stylesheets/App.css';
import Game from '../components/Game';

class App extends React.Component {
  render() {
    return (
      <div className="app">
        <div className="appHeader">
          <h2>Minesweeper</h2>
        </div>
        <Game />
      </div>
    );
  }
}

export default App;