import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { toast } from 'react-hot-toast';
import Confetti from 'react-confetti';
import useWindowSize from 'react-use/lib/useWindowSize';

// Card component for displaying playing cards
const Card = ({ value, suit, hidden = false, isDealer = false, index = 0 }) => {
  const suits = {
    hearts: '♥',
    diamonds: '♦',
    clubs: '♣',
    spades: '♠'
  };

  const colors = {
    hearts: 'text-red-600',
    diamonds: 'text-red-600',
    clubs: 'text-black',
    spades: 'text-black'
  };

  if (hidden) {
    return (
      <motion.div 
        className="w-20 h-28 bg-gradient-to-br from-blue-600 to-blue-800 rounded-lg shadow-md flex items-center justify-center relative overflow-hidden"
        initial={{ rotateY: 0 }}
        animate={{ rotateY: 180 }}
        transition={{ duration: 0.5 }}
      >
        <div className="absolute inset-0.5 bg-gradient-to-br from-blue-400 to-blue-600 rounded-md flex items-center justify-center">
          <div className="w-8 h-10 bg-white/20 rounded-sm rotate-45"></div>
        </div>
      </motion.div>
    );
  }

  const cardValue = value === 'A' ? 'A' : value === 'K' ? 'K' : value === 'Q' ? 'Q' : value === 'J' ? 'J' : value;
  const isRed = suit === 'hearts' || suit === 'diamonds';

  return (
    <motion.div 
      className={`w-20 h-28 bg-white rounded-lg shadow-md flex flex-col p-2 ${colors[suit]}`}
      initial={{ x: isDealer ? -20 * index : 20 * index, y: isDealer ? 0 : 0, rotate: isDealer ? -5 : 5 }}
      animate={{ x: 0, y: 0, rotate: 0 }}
      transition={{ 
        type: 'spring', 
        stiffness: 100, 
        damping: 10,
        delay: index * 0.1
      }}
      whileHover={{ y: -10, zIndex: 10 }}
    >
      <div className="text-left text-lg font-bold">{cardValue}</div>
      <div className="text-3xl flex-1 flex items-center justify-center">
        {suits[suit]}
      </div>
      <div className="text-right text-lg font-bold transform rotate-180">{cardValue}</div>
    </motion.div>
  );
};

// Blackjack game component
const Blackjack = () => {
  const { width, height } = useWindowSize();
  const { user, updateTokens, updateChips } = useContext(AppContext);
  const [bet, setBet] = useState(0);
  const [gameState, setGameState] = useState('betting'); // betting, dealing, playerTurn, dealerTurn, gameOver
  const [playerHand, setPlayerHand] = useState([]);
  const [dealerHand, setDealerHand] = useState([]);
  const [dealerHidden, setDealerHidden] = useState(true);
  const [message, setMessage] = useState('Place your bet to start playing!');
  const [showConfetti, setShowConfetti] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [dealerScore, setDealerScore] = useState(0);
  const [canDoubleDown, setCanDoubleDown] = useState(false);
  const [canSplit, setCanSplit] = useState(false);

  // Card values for scoring
  const cardValues = {
    '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, '10': 10,
    'J': 10, 'Q': 10, 'K': 10, 'A': 11
  };

  // Create a new deck of cards
  const createDeck = () => {
    const suits = ['hearts', 'diamonds', 'clubs', 'spades'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck = [];
    
    for (let suit of suits) {
      for (let value of values) {
        deck.push({ value, suit });
      }
    }
    
    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }
    
    return deck;
  };

  // Calculate the score of a hand
  const calculateScore = (hand) => {
    let score = 0;
    let aces = 0;
    
    for (let card of hand) {
      score += cardValues[card.value];
      if (card.value === 'A') aces++;
    }
    
    // Handle aces
    while (score > 21 && aces > 0) {
      score -= 10;
      aces--;
    }
    
    return score;
  };

  // Start a new round
  const startNewRound = () => {
    if (bet <= 0 || bet > user.chips) {
      toast.error('Please enter a valid bet amount');
      return;
    }
    
    // Deduct the bet from chips
    updateChips(-bet);
    
    // Create and shuffle a new deck
    const deck = createDeck();
    
    // Deal initial cards
    const newPlayerHand = [deck.pop(), deck.pop()];
    const newDealerHand = [deck.pop(), deck.pop()];
    
    setPlayerHand(newPlayerHand);
    setDealerHand(newDealerHand);
    setDealerHidden(true);
    
    // Calculate initial scores
    const playerScore = calculateScore(newPlayerHand);
    const dealerScore = calculateScore([newDealerHand[0]]); // Only show dealer's first card
    
    setPlayerScore(playerScore);
    setDealerScore(dealerScore);
    
    // Check for blackjack
    if (playerScore === 21) {
      // Player has blackjack
      setTimeout(() => {
        endGame('blackjack');
      }, 1000);
      return;
    }
    
    setGameState('playerTurn');
    setMessage('Hit or Stand?');
    
    // Check if player can double down or split
    setCanDoubleDown(user.chips >= bet && newPlayerHand.length === 2);
    setCanSplit(newPlayerHand[0].value === newPlayerHand[1].value && user.chips >= bet);
  };

  // Player hits (takes another card)
  const hit = () => {
    if (gameState !== 'playerTurn') return;
    
    const deck = createDeck().filter(card => 
      ![...playerHand, ...dealerHand].some(c => 
        c.value === card.value && c.suit === card.suit
      )
    );
    
    const newCard = deck[Math.floor(Math.random() * deck.length)];
    const newPlayerHand = [...playerHand, newCard];
    const newScore = calculateScore(newPlayerHand);
    
    setPlayerHand(newPlayerHand);
    setPlayerScore(newScore);
    
    // Check for bust
    if (newScore > 21) {
      setTimeout(() => {
        endGame('bust');
      }, 500);
    } else if (newScore === 21) {
      // Player has 21, dealer's turn
      setTimeout(dealerTurn, 1000);
    }
    
    // Can't double down or split after hitting
    setCanDoubleDown(false);
    setCanSplit(false);
  };

  // Player stands (ends their turn)
  const stand = () => {
    if (gameState !== 'playerTurn') return;
    dealerTurn();
  };

  // Double down (double the bet, take one card, then stand)
  const doubleDown = () => {
    if (!canDoubleDown) return;
    
    // Double the bet
    updateChips(-bet);
    setBet(prevBet => prevBet * 2);
    
    // Take one card
    const deck = createDeck().filter(card => 
      ![...playerHand, ...dealerHand].some(c => 
        c.value === card.value && c.suit === card.suit
      )
    );
    
    const newCard = deck[Math.floor(Math.random() * deck.length)];
    const newPlayerHand = [...playerHand, newCard];
    const newScore = calculateScore(newPlayerHand);
    
    setPlayerHand(newPlayerHand);
    setPlayerScore(newScore);
    
    // End player's turn after double down
    setTimeout(() => {
      if (newScore > 21) {
        endGame('bust');
      } else {
        dealerTurn();
      }
    }, 1000);
    
    // Can't double down or split after doubling down
    setCanDoubleDown(false);
    setCanSplit(false);
  };

  // Dealer's turn
  const dealerTurn = () => {
    setGameState('dealerTurn');
    setDealerHidden(false);
    
    // Calculate dealer's actual score with all cards
    const dealerActualScore = calculateScore(dealerHand);
    setDealerScore(dealerActualScore);
    
    // Dealer hits on 16, stands on 17 or higher
    if (dealerActualScore >= 17) {
      // Dealer stands
      setTimeout(() => {
        endGame('dealerStand');
      }, 1500);
    } else {
      // Dealer hits
      setTimeout(() => {
        const deck = createDeck().filter(card => 
          ![...playerHand, ...dealerHand].some(c => 
            c.value === card.value && c.suit === card.suit
          )
        );
        
        const newCard = deck[Math.floor(Math.random() * deck.length)];
        const newDealerHand = [...dealerHand, newCard];
        const newDealerScore = calculateScore(newDealerHand);
        
        setDealerHand(newDealerHand);
        setDealerScore(newDealerScore);
        
        // Check if dealer busts or should hit again
        if (newDealerScore > 21) {
          setTimeout(() => {
            endGame('dealerBust');
          }, 1000);
        } else if (newDealerScore >= 17) {
          setTimeout(() => {
            endGame('dealerStand');
          }, 1500);
        } else {
          // Dealer hits again
          setTimeout(dealerTurn, 1000);
        }
      }, 1000);
    }
  };

  // End the game and determine the winner
  const endGame = (result) => {
    setGameState('gameOver');
    setDealerHidden(false);
    
    let tokensWon = 0;
    let message = '';
    
    switch (result) {
      case 'blackjack':
        tokensWon = Math.floor(bet * 2.5); // 3:2 payout for blackjack
        message = `Blackjack! You won ${tokensWon} tokens!`;
        setShowConfetti(true);
        break;
        
      case 'bust':
        message = 'Bust! You went over 21.';
        tokensWon = 0;
        break;
        
      case 'dealerBust':
        tokensWon = bet * 2; // 1:1 payout
        message = `Dealer busts! You won ${tokensWon} tokens!`;
        setShowConfetti(true);
        break;
        
      case 'dealerStand':
        if (playerScore > dealerScore) {
          tokensWon = bet * 2; // 1:1 payout
          message = `You win! ${playerScore} to ${dealerScore}. You won ${tokensWon} tokens!`;
          setShowConfetti(true);
        } else if (playerScore < dealerScore) {
          message = `You lose! ${playerScore} to ${dealerScore}.`;
          tokensWon = 0;
        } else {
          // Push (tie) - return the bet
          tokensWon = bet;
          message = `Push! It's a tie at ${playerScore}. Your bet has been returned.`;
        }
        break;
        
      default:
        message = 'Game over!';
        tokensWon = 0;
    }
    
    setMessage(message);
    
    // Update tokens if player won
    if (tokensWon > 0) {
      updateTokens(tokensWon);
    }
    
    // Reset game after a delay
    setTimeout(() => {
      setShowConfetti(false);
    }, 5000);
  };

  // Start a new game
  const newGame = () => {
    setGameState('betting');
    setPlayerHand([]);
    setDealerHand([]);
    setPlayerScore(0);
    setDealerScore(0);
    setMessage('Place your bet to start playing!');
  };

  // Handle bet input
  const handleBetChange = (e) => {
    const value = parseInt(e.target.value) || 0;
    setBet(Math.min(value, user.chips));
  };

  // Handle max bet
  const setMaxBet = () => {
    setBet(user.chips);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-800 to-green-900 py-8 px-4">
      {/* Confetti for wins */}
      <AnimatePresence>
        {showConfetti && (
          <Confetti
            width={width}
            height={height}
            recycle={false}
            numberOfPieces={500}
            gravity={0.2}
          />
        )}
      </AnimatePresence>

      <div className="max-w-4xl mx-auto">
        {/* Game header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">Blackjack</h1>
          <p className="text-lg text-green-200">{message}</p>
        </div>

        {/* Dealer's hand */}
        <div className="bg-green-700 rounded-xl p-6 mb-6 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Dealer's Hand</h2>
            {!dealerHidden && (
              <div className="text-white text-lg font-bold">
                Score: {dealerScore}
              </div>
            )}
          </div>
          <div className="flex flex-wrap gap-3 min-h-32 items-center justify-center">
            {dealerHand.map((card, index) => (
              <div key={index} className="relative">
                {index === 1 && dealerHidden ? (
                  <Card hidden={true} isDealer={true} />
                ) : (
                  <Card 
                    value={card.value} 
                    suit={card.suit} 
                    isDealer={true}
                    index={index}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Player's hand */}
        <div className="bg-green-700 rounded-xl p-6 mb-8 shadow-lg">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-white">Your Hand</h2>
            <div className="text-white text-lg font-bold">
              Score: {playerScore}
            </div>
          </div>
          <div className="flex flex-wrap gap-3 min-h-32 items-center justify-center">
            {playerHand.map((card, index) => (
              <Card 
                key={index} 
                value={card.value} 
                suit={card.suit} 
                index={index}
              />
            ))}
          </div>
        </div>

        {/* Game controls */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          {gameState === 'betting' ? (
            <div className="space-y-6">
              <div>
                <label htmlFor="bet" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Bet Amount (You have {user.chips} chips)
                </label>
                <div className="flex">
                  <input
                    type="number"
                    id="bet"
                    min="1"
                    max={user.chips}
                    value={bet || ''}
                    onChange={handleBetChange}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-l-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    placeholder="Enter bet amount"
                  />
                  <button
                    type="button"
                    onClick={setMaxBet}
                    className="px-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium border-t border-b border-r border-gray-300 dark:border-gray-600 rounded-r-lg dark:bg-gray-600 dark:text-white dark:hover:bg-gray-500"
                  >
                    Max
                  </button>
                </div>
              </div>
              <button
                onClick={startNewRound}
                disabled={!bet || bet <= 0 || bet > user.chips}
                className="w-full btn btn-primary py-3 text-lg"
              >
                Deal Cards
              </button>
            </div>
          ) : gameState === 'playerTurn' ? (
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={hit}
                className="btn bg-red-600 hover:bg-red-700 text-white py-3 text-lg"
              >
                Hit
              </button>
              <button
                onClick={stand}
                className="btn bg-green-600 hover:bg-green-700 text-white py-3 text-lg"
              >
                Stand
              </button>
              <button
                onClick={doubleDown}
                disabled={!canDoubleDown}
                className={`btn bg-blue-600 hover:bg-blue-700 text-white py-3 text-lg ${!canDoubleDown ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Double Down
              </button>
              <button
                disabled={!canSplit}
                className={`btn bg-purple-600 hover:bg-purple-700 text-white py-3 text-lg ${!canSplit ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                Split
              </button>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={newGame}
                className="btn btn-primary py-3 px-8 text-lg"
              >
                Play Again
              </button>
            </div>
          )}
        </div>

        {/* Game instructions */}
        <div className="mt-8 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3">How to Play</h3>
          <ul className="text-gray-700 dark:text-gray-300 space-y-2 text-sm">
            <li>• <strong>Hit:</strong> Take another card from the deck.</li>
            <li>• <strong>Stand:</strong> Keep your current hand and end your turn.</li>
            <li>• <strong>Double Down:</strong> Double your bet and take exactly one more card.</li>
            <li>• <strong>Split:</strong> If you have two cards of the same value, you can split them into two separate hands.</li>
            <li>• Get as close to 21 as possible without going over. Face cards are worth 10, Aces are 1 or 11.</li>
            <li>• Blackjack (Ace + 10-value card) pays 3:2.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Blackjack;
