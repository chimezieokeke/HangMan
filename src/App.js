import React from 'react';
import './App.css';
import HangmanGame from './HangmanGame';

class App extends React.Component {
  state = {
    wordList: ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"],
    curWord: 0,
    lifeLeft: 0,
    usedLetters: [],
    playerName: ''
  };

  // Method to update the player's name
  getPlayerName = (name) => {
    this.setState({ playerName: name });
  }

  // Method to start a new game
  startNewGame = () => {
    this.setState({
      curWord: Math.floor(Math.random() * this.state.wordList.length),
      lifeLeft: 0, // Reset life count for a new game
      usedLetters: [] // Reset used letters for a new game
    });
  }

  render() {
    return (
      <div>
        <h1>Welcome to Hangman</h1>
        <HangmanGame 
          wordList={this.state.wordList} 
          curWord={this.state.curWord} 
          lifeLeft={this.state.lifeLeft} 
          usedLetters={this.state.usedLetters} 
          startNewGame={this.startNewGame} 
        />
      </div>
    );
  }
}

export default App;
