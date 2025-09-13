import { useState, useEffect, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';

// Mock data for leaderboard (in a real app, this would come from a backend)
const mockLeaderboardData = [
  { id: 1, name: 'Alex Johnson', tokens: 1250, rank: 1, avatar: 'https://randomuser.me/api/portraits/men/32.jpg' },
  { id: 2, name: 'Sarah Williams', tokens: 1180, rank: 2, avatar: 'https://randomuser.me/api/portraits/women/44.jpg' },
  { id: 3, name: 'Michael Chen', tokens: 1120, rank: 3, avatar: 'https://randomuser.me/api/portraits/men/29.jpg' },
  { id: 4, name: 'Emily Davis', tokens: 980, rank: 4, avatar: 'https://randomuser.me/api/portraits/women/68.jpg' },
  { id: 5, name: 'David Kim', tokens: 875, rank: 5, avatar: 'https://randomuser.me/api/portraits/men/45.jpg' },
  { id: 6, name: 'Jessica Lee', tokens: 820, rank: 6, avatar: 'https://randomuser.me/api/portraits/women/33.jpg' },
  { id: 7, name: 'Ryan Park', tokens: 765, rank: 7, avatar: 'https://randomuser.me/api/portraits/men/51.jpg' },
  { id: 8, name: 'Olivia Brown', tokens: 720, rank: 8, avatar: 'https://randomuser.me/api/portraits/women/29.jpg' },
  { id: 9, name: 'Ethan Garcia', tokens: 680, rank: 9, avatar: 'https://randomuser.me/api/portraits/men/36.jpg' },
  { id: 10, name: 'Sophia Martinez', tokens: 635, rank: 10, avatar: 'https://randomuser.me/api/portraits/women/51.jpg' },
];

const Leaderboard = () => {
  const { user } = useContext(AppContext);
  const [timeRange, setTimeRange] = useState('all-time');
  const [leaderboardData, setLeaderboardData] = useState([]);
  const [userRank, setUserRank] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // In a real app, this would be an API call to fetch leaderboard data
  useEffect(() => {
    const fetchLeaderboardData = async () => {
      setIsLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        // Add current user to the leaderboard if not already present
        const userInLeaderboard = mockLeaderboardData.some(entry => entry.id === user.id);
        let updatedLeaderboard = [...mockLeaderboardData];
        
        if (!userInLeaderboard) {
          // Create a user entry with a random rank below the top 10
          const userEntry = {
            id: user.id,
            name: user.name || 'You',
            tokens: user.tokens || 0,
            rank: Math.floor(Math.random() * 50) + 11, // Random rank between 11-60
            avatar: user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg',
            isCurrentUser: true
          };
          
          updatedLeaderboard = [...mockLeaderboardData, userEntry];
          
          // Sort by tokens in descending order
          updatedLeaderboard.sort((a, b) => b.tokens - a.tokens);
          
          // Update ranks
          updatedLeaderboard = updatedLeaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
          
          // Find the current user's rank
          const currentUserRank = updatedLeaderboard.find(entry => entry.id === user.id)?.rank;
          if (currentUserRank) {
            setUserRank(currentUserRank);
          }
        } else {
          // Update current user's token count in the leaderboard
          updatedLeaderboard = updatedLeaderboard.map(entry => 
            entry.id === user.id 
              ? { ...entry, tokens: user.tokens || 0, name: user.name || entry.name }
              : entry
          );
          
          // Sort again in case token counts changed
          updatedLeaderboard.sort((a, b) => b.tokens - a.tokens);
          
          // Update ranks
          updatedLeaderboard = updatedLeaderboard.map((entry, index) => ({
            ...entry,
            rank: index + 1
          }));
          
          // Find the current user's rank
          const currentUserRank = updatedLeaderboard.find(entry => entry.id === user.id)?.rank;
          if (currentUserRank) {
            setUserRank(currentUserRank);
          }
        }
        
        setLeaderboardData(updatedLeaderboard.slice(0, 10)); // Show top 10
        setIsLoading(false);
      }, 800);
    };
    
    fetchLeaderboardData();
  }, [timeRange, user]);

  // Get medal emoji based on rank
  const getMedal = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  // Get rank badge color
  const getRankBadgeClass = (rank) => {
    switch (rank) {
      case 1: return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 2: return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
      case 3: return 'bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200';
      default: return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200';
    }
  };

  // Get user's position relative to the leaderboard
  const getUserPosition = () => {
    if (!userRank) return null;
    
    if (userRank <= 10) {
      return `You're #${userRank} on the leaderboard!`;
    } else {
      const topPercentage = Math.round((userRank / 100) * 100); // Assuming 100 total players
      return `You're in the top ${topPercentage}% of all players!`;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div 
          className="text-center mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">Leaderboard</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            See how you compare to other students
          </p>
          
          {/* Time range selector */}
          <div className="mt-6 flex justify-center space-x-2">
            {['all-time', 'this-month', 'this-week'].map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  timeRange === range
                    ? 'bg-primary text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                }`}
              >
                {range.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </button>
            ))}
          </div>
        </motion.div>

        {/* User stats summary */}
        {userRank && (
          <motion.div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex items-center mb-4 md:mb-0">
                <div className="relative">
                  <img 
                    src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                    alt={user.name || 'You'} 
                    className="w-16 h-16 rounded-full border-4 border-primary/20"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-primary text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                    {userRank}
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name || 'You'}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{user.tokens || 0} tokens</p>
                </div>
              </div>
              <div className="text-center md:text-right">
                <p className="text-sm text-gray-500 dark:text-gray-400">Your Rank</p>
                <p className="text-2xl font-bold text-primary dark:text-primary-300">
                  {userRank <= 3 ? getMedal(userRank) : `#${userRank}`}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                  {getUserPosition()}
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Leaderboard */}
        <motion.div 
          className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                Top Players
              </h2>
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {timeRange === 'all-time' ? 'All Time' : timeRange === 'this-month' ? 'This Month' : 'This Week'}
              </div>
            </div>
          </div>
          
          {isLoading ? (
            <div className="py-12 flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
            </div>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {leaderboardData.map((player, index) => (
                <motion.div 
                  key={player.id}
                  className={`flex items-center px-6 py-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors ${
                    player.id === user.id ? 'bg-blue-50 dark:bg-blue-900/30' : ''
                  }`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                >
                  <div className="flex-shrink-0 w-10 text-center">
                    <span className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold ${
                      player.rank <= 3 
                        ? getRankBadgeClass(player.rank) 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200'
                    }`}>
                      {player.rank <= 3 ? getMedal(player.rank) : player.rank}
                    </span>
                  </div>
                  <div className="flex items-center flex-1 min-w-0">
                    <div className="flex-shrink-0">
                      <img 
                        className="h-10 w-10 rounded-full" 
                        src={player.avatar} 
                        alt={player.name} 
                      />
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                        {player.name} {player.id === user.id && '(You)'}
                      </p>
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        {player.tokens.toLocaleString()} tokens
                      </p>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0">
                    <div className="flex items-center">
                      <span className="text-yellow-400 text-xl">★</span>
                      <span className="ml-1 text-gray-900 dark:text-white font-medium">
                        {Math.floor(player.tokens / 100)}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {!isLoading && userRank > 10 && (
            <div className="px-6 py-4 bg-gray-50 dark:bg-gray-800/50 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your rank: <span className="font-medium text-gray-900 dark:text-white">#{userRank}</span>
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                {getUserPosition()}
              </p>
            </div>
          )}
        </motion.div>

        {/* Stats and achievements */}
        <motion.div 
          className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {/* Top Performer */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Top Performer</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {leaderboardData[0]?.name || 'No data'} is leading with {leaderboardData[0]?.tokens.toLocaleString() || '0'} tokens!
            </p>
          </div>
          
          {/* Your Progress */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Your Progress</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              You've earned {user.tokens || 0} tokens so far. Keep it up!
            </p>
          </div>
          
          {/* Next Milestone */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
            <div className="flex items-center mb-4">
              <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
              </div>
              <h3 className="ml-3 text-lg font-medium text-gray-900 dark:text-white">Next Milestone</h3>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {user.tokens < 1000 
                ? `Just ${1000 - (user.tokens || 0)} tokens until you reach 1,000!`
                : `You've reached the 1,000 token milestone!`}
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Leaderboard;
