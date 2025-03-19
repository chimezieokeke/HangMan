import './App.css';
import React from 'react';

// Images for hangman stages
const pics = [
  '/noose.png', 
  '/upper body.png', 
  '/upperandlowerbody.png', 
  '/1arm.png', 
  '/botharms.png', 
  '/1leg.png',
  '/dead.png'
];

// Words for the hangman game
const words = ["Morehouse", "Spelman", "Basketball", "Table", "Museum", "Excellent", "Fun", "React"];

class HangmanGame extends React.Component {
  state = {
    wordList: words,
    curWordIndex: 0,
    lifeLeft: 0,
    usedLetters: [],
    letter: '',
    playerName: '',
    gameStatus: 'initial', // 'initial', 'playing', 'won', 'lost'
    showNameInput: true
  }

  componentDidMount() {
    this.setState({ curWordIndex: Math.floor(Math.random() * words.length) });
  }

  // Handle name input to start the game
  getPlayerName = (e) => {
    e.preventDefault();
    if (this.state.playerName.trim()) {
      this.setState({ showNameInput: false, gameStatus: 'playing' });
      this.startNewGame();
    }
  }

  handleNameChange = (e) => {
    this.setState({ playerName: e.target.value });
  }

  // Start a new game
  startNewGame = () => {
    this.setState({
      curWordIndex: Math.floor(Math.random() * this.state.wordList.length),
      lifeLeft: 0,
      usedLetters: [],
      gameStatus: 'playing'
    });
  }

  // Handle the letter guess
  handleSearch = (letter) => {
    const word = this.state.wordList[this.state.curWordIndex];
    const lowerLetter = letter.toLowerCase();
    
    if (!word.toLowerCase().includes(lowerLetter)) {
      // Wrong guess - only increment lifeLeft if this is a new incorrect letter
      if (!this.state.usedLetters.includes(lowerLetter)) {
        this.setState(prevState => {
          const newLifeLeft = prevState.lifeLeft + 1;
          const newGameStatus = newLifeLeft >= pics.length - 1 ? 'lost' : prevState.gameStatus;
          return {
            lifeLeft: newLifeLeft,
            gameStatus: newGameStatus,
            usedLetters: [...prevState.usedLetters, lowerLetter]
          };
        });
      }
    } else {
      // Correct guess - update usedLetters and check if the word is fully guessed
      if (!this.state.usedLetters.includes(lowerLetter)) {
        this.setState(prevState => {
          const updatedUsedLetters = [...prevState.usedLetters, lowerLetter];

          const wordLetters = word.toLowerCase().split('');
          const uniqueLetters = [...new Set(wordLetters)];

          // Check if all unique letters in the word have been guessed
          const allLettersGuessed = uniqueLetters.every(char =>
            updatedUsedLetters.includes(char) || char === ' ' || lowerLetter === char
          );

          if (allLettersGuessed) {
            return { 
              usedLetters: updatedUsedLetters,
              gameStatus: 'won'
            };
          }

          return { usedLetters: updatedUsedLetters };
        });
      }
    }
  }

  // Handle letter input change
  handleInputChange = (e) => {
    if (/^[a-zA-Z]$/.test(e.target.value) || e.target.value === '') {
      this.setState({ letter: e.target.value.toLowerCase() });
    }
  }

  // Handle guess submission (click or press Enter)
  handleSearchClick = () => {
    if (this.state.letter && this.state.gameStatus === 'playing') {
      this.handleSearch(this.state.letter);
      this.setState({ letter: '' }); // Reset input after search
    }
  }

  // Handle pressing Enter key for letter submission
  handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      this.handleSearchClick();
    }
  }

  // Render the masked word with guessed letters
  renderWord = () => {
    const word = this.state.wordList[this.state.curWordIndex] || '';
    return word.split('').map((char, index) => {
      const isGuessed = this.state.usedLetters.includes(char.toLowerCase());
      return (
        <LetterBox
          key={index}
          letter={char}
          isVisible={isGuessed || char === ' ' || this.state.gameStatus === 'lost'}
          boxStyle={{
            display: 'inline-block',
            width: '30px',
            height: '40px',
            margin: '5px',
            backgroundColor: 'lightblue',
            textAlign: 'center',
            verticalAlign: 'middle',
            lineHeight: '40px'
          }}
          letterStyle={{ 
            color: 'navy', 
            fontSize: '24px',
            fontWeight: 'bold'
          }}
        />
      );
    });
  }

  // Display used letters
  renderUsedLetters = () => {
    return (
      <div className="used-letters">
        <h3>Used Letters:</h3>
        <div>
          {this.state.usedLetters.map((letter, index) => (
            <span key={index} style={{ margin: '0 5px', fontSize: '18px' }}>
              {letter.toUpperCase()}
            </span>
          ))}
        </div>
      </div>
    );
  }

  render() {
    const { gameStatus, showNameInput, lifeLeft, letter, playerName } = this.state;

    // Player name input screen
    if (showNameInput) {
      return (
        <div className="name-input-container" style={{ textAlign: 'center', marginTop: '50px' }}>
          <h2>Hangman Game</h2>
          <form onSubmit={this.getPlayerName}>
            <input
              type="text"
              value={this.state.playerName}
              onChange={this.handleNameChange}
              placeholder="Enter your name"
              style={{ padding: '8px', marginRight: '10px' }}
            />
            <button type="submit" style={{ padding: '8px 15px' }}>Start Game</button>
          </form>
        </div>
      );
    }

    return (
      <div className="hangman-container" style={{ textAlign: 'center' }}>
        <h2>Hangman Game</h2>
        <p>Player: {playerName}</p>

        {/* Game status message */}
        {gameStatus === 'won' && (
          <div className="win-message" style={{ color: 'green', fontSize: '24px', margin: '10px 0' }}>
            Congratulations! You've won!
          </div>
        )}
        
        {gameStatus === 'lost' && (
          <div className="lose-message" style={{ color: 'red', fontSize: '24px', margin: '10px 0' }}>
            Game Over! The word was: {this.state.wordList[this.state.curWordIndex]}
          </div>
        )}

        {/* Hangman image */}
        <div className="hangman-image" style={{ margin: '20px 0' }}>
          <img 
            src={pics[lifeLeft]} 
            alt={`Hangman Stage ${lifeLeft}`} 
            style={{ maxHeight: '200px' }}
            onError={(e) => {
              console.error(`Failed to load image: ${pics[lifeLeft]}`);
              e.target.src = '/noose.png'; 
              e.target.alt = 'Image not available';
            }}
          />
        </div>

        {/* Word display */}
        <div className="word-container" style={{ margin: '20px 0' }}>
          {this.renderWord()}
        </div>

        {/* Letter input */}
        <div className="letter-input" style={{ margin: '20px 0' }}>
          <input
            type="text"
            value={letter}
            onChange={this.handleInputChange}
            onKeyPress={this.handleKeyPress}
            maxLength="1"
            disabled={gameStatus !== 'playing'}
            style={{ padding: '10px', marginRight: '10px', width: '40px', textAlign: 'center' }}
          />
          <button 
            onClick={this.handleSearchClick}
            disabled={gameStatus !== 'playing' || !letter}
            style={{ padding: '10px 20px' }}
          >
            Guess
          </button>
        </div>

        {/* Used letters */}
        {this.renderUsedLetters()}

        {/* New game button */}
        <button 
          onClick={this.startNewGame}
          style={{ 
            marginTop: '20px', 
            padding: '10px 20px', 
            backgroundColor: '#4CAF50', 
            color: 'white', 
            border: 'none', 
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          New Game
        </button>
      </div>
    );
  }
}

// LetterBox component to display individual letters
class LetterBox extends React.Component {
  render() {
    const { letter, isVisible, boxStyle, letterStyle } = this.props;
    return (
      <div style={boxStyle}>
        {isVisible ? 
          <span style={letterStyle}>{letter}</span> : 
          <span style={letterStyle}>_</span>
        }
      </div>
    );
  }
}

export default HangmanGame;
