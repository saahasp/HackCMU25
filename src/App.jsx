import { useState, createContext, useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Blackjack from './pages/Blackjack';
import PrizeShop from './pages/PrizeShop';
import Leaderboard from './pages/Leaderboard';
import { Toaster } from 'react-hot-toast';

export const AppContext = createContext();

function App() {
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true' || false;
  });
  
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : {
      name: '',
      chips: 0,
      tokens: 0,
      grades: [],
      gamesPlayed: 0,
      gamesWon: 0,
    };
  });

  // Save user data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('user', JSON.stringify(user));
  }, [user]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode);
  };

  // Add grade and calculate chips
  const addGrade = (assignmentName, grade) => {
    let chipsEarned = 0;
    
    if (grade >= 100) chipsEarned = 10;
    else if (grade >= 98) chipsEarned = 7;
    else if (grade >= 95) chipsEarned = 5;
    else if (grade >= 90) chipsEarned = 2;
    
    if (chipsEarned > 0) {
      setUser(prev => ({
        ...prev,
        chips: prev.chips + chipsEarned,
        grades: [...prev.grades, { name: assignmentName, grade, chipsEarned, date: new Date().toISOString() }]
      }));
      
      return chipsEarned;
    }
    
    return 0;
  };

  // Update tokens after a game
  const updateTokens = (tokensWon) => {
    setUser(prev => ({
      ...prev,
      tokens: prev.tokens + tokensWon,
      gamesPlayed: prev.gamesPlayed + 1,
      gamesWon: tokensWon > 0 ? prev.gamesWon + 1 : prev.gamesWon
    }));
  };

  // Update chips after betting
  const updateChips = (chipsChange) => {
    setUser(prev => ({
      ...prev,
      chips: Math.max(0, prev.chips + chipsChange)
    }));
  };

  return (
    <AppContext.Provider value={{ user, darkMode, toggleDarkMode, addGrade, updateTokens, updateChips }}>
      <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark bg-background-dark' : 'bg-background-light'}`}>
        <Navbar />
        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/blackjack" element={<Blackjack />} />
            <Route path="/prizes" element={<PrizeShop />} />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Toaster position="bottom-right" />
      </div>
    </AppContext.Provider>
  );
}

export default App;
