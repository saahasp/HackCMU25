import { useContext, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';

// Mock achievements data
const achievements = [
  { id: 1, name: 'First Steps', description: 'Earn your first 100 tokens', icon: '🏆', unlocked: true, progress: 100, target: 100 },
  { id: 2, name: 'Blackjack Pro', description: 'Win 10 games of Blackjack', icon: '🎲', unlocked: false, progress: 4, target: 10 },
  { id: 3, name: 'Straight A Student', description: 'Get 5 A grades in a row', icon: '🎓', unlocked: false, progress: 2, target: 5 },
  { id: 4, name: 'High Roller', description: 'Earn 1000 tokens in a single day', icon: '💰', unlocked: false, progress: 0, target: 1 },
  { id: 5, name: 'Token Collector', description: 'Reach 5000 lifetime tokens', icon: '🪙', unlocked: false, progress: 320, target: 5000 },
  { id: 6, name: 'Early Bird', description: 'Log in 7 days in a row', icon: '⏰', unlocked: true, progress: 7, target: 7 },
];

// Mock recent activity data
const recentActivity = [
  { id: 1, type: 'game', title: 'Won Blackjack', description: 'You won 50 tokens in Blackjack', timestamp: '2 hours ago', icon: '🎲' },
  { id: 2, type: 'grade', title: 'New Grade Added', description: 'You earned 25 chips for an A in Math', timestamp: '1 day ago', icon: '📚' },
  { id: 3, type: 'prize', title: 'Prize Redeemed', description: 'You redeemed a coffee voucher for 50 tokens', timestamp: '2 days ago', icon: '🏆' },
  { id: 4, type: 'achievement', title: 'Achievement Unlocked', description: 'First Steps: Earn your first 100 tokens', timestamp: '3 days ago', icon: '🎯' },
  { id: 5, type: 'game', title: 'Played Blackjack', description: 'You played a game of Blackjack', timestamp: '3 days ago', icon: '🎲' },
];

const Profile = () => {
  const { user } = useContext(AppContext);
  const [activeTab, setActiveTab] = useState('overview');
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user.name || '');
  
  // Calculate user statistics
  const stats = [
    { name: 'Total Tokens', value: user.tokens || 0, change: '+125', trend: 'up' },
    { name: 'Chips', value: user.chips || 0, change: '+25', trend: 'up' },
    { name: 'Games Played', value: 12, change: '+3', trend: 'up' },
    { name: 'Win Rate', value: '68%', change: '+5%', trend: 'up' },
  ];

  // Handle name update
  const handleNameUpdate = (e) => {
    e.preventDefault();
    // In a real app, this would update the user's name via an API call
    user.name = editedName;
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden mb-8">
          <div className="h-32 bg-gradient-to-r from-primary to-secondary"></div>
          <div className="px-8 pb-8 -mt-16 relative">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
              <div className="flex items-end">
                <div className="relative">
                  <img 
                    src={user.avatar || 'https://randomuser.me/api/portraits/lego/1.jpg'} 
                    alt={user.name || 'User'} 
                    className="h-32 w-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                  <button className="absolute bottom-0 right-0 bg-white dark:bg-gray-700 p-2 rounded-full shadow-md hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600 dark:text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </button>
                </div>
                <div className="ml-6 mb-4">
                  {isEditing ? (
                    <form onSubmit={handleNameUpdate} className="flex items-center">
                      <input
                        type="text"
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        className="text-3xl font-bold bg-transparent border-b-2 border-primary focus:outline-none focus:border-primary-dark dark:text-white"
                        autoFocus
                      />
                      <button 
                        type="submit"
                        className="ml-2 p-1 text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                      </button>
                      <button 
                        type="button"
                        onClick={() => {
                          setEditedName(user.name || '');
                          setIsEditing(false);
                        }}
                        className="ml-1 p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </form>
                  ) : (
                    <div className="flex items-center">
                      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        {user.name || 'Anonymous User'}
                      </h1>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="ml-2 p-1 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <p className="text-gray-600 dark:text-gray-300">@{user.username || 'student'}</p>
                </div>
              </div>
              <div className="flex space-x-4">
                <button className="px-4 py-2 bg-white dark:bg-gray-700 text-gray-800 dark:text-white rounded-lg border border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                  View Public Profile
                </button>
                <button className="px-4 py-2 bg-primary hover:bg-primary-dark text-white rounded-lg transition-colors flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  Edit Profile
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div 
              key={stat.name}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.name}</p>
                  <p className="mt-1 text-3xl font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                </div>
                <div className={`flex items-center px-2 py-1 rounded-full text-sm font-medium ${
                  stat.trend === 'up' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {stat.trend === 'up' ? (
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                    </svg>
                  ) : (
                    <svg className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
                    </svg>
                  )}
                  {stat.change}
                </div>
              </div>
              <div className="mt-4">
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-primary to-secondary"
                    style={{ width: `${Math.min(100, Math.max(0, (parseInt(stat.value) / 1000) * 100))}%` }}
                  ></div>
                </div>
                <p className="mt-1 text-xs text-right text-gray-500 dark:text-gray-400">
                  {stat.name === 'Win Rate' ? 'This month' : 'To next milestone'}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Achievements */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Achievements</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {achievements.map((achievement) => (
                    <div 
                      key={achievement.id}
                      className={`p-4 rounded-lg border ${
                        achievement.unlocked 
                          ? 'border-green-200 bg-green-50 dark:border-green-900 dark:bg-green-900/20' 
                          : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-700/50'
                      }`}
                    >
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <div className={`h-12 w-12 rounded-full flex items-center justify-center text-2xl ${
                            achievement.unlocked 
                              ? 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-200' 
                              : 'bg-gray-100 text-gray-400 dark:bg-gray-600 dark:text-gray-300'
                          }`}>
                            {achievement.icon}
                          </div>
                        </div>
                        <div className="ml-4 flex-1">
                          <h3 className={`text-lg font-medium ${
                            achievement.unlocked 
                              ? 'text-green-800 dark:text-green-100' 
                              : 'text-gray-800 dark:text-gray-200'
                          }`}>
                            {achievement.name}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {achievement.description}
                          </p>
                          {!achievement.unlocked && (
                            <div className="mt-2">
                              <div className="h-2 bg-gray-200 dark:bg-gray-600 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-primary to-secondary"
                                  style={{ width: `${(achievement.progress / achievement.target) * 100}%` }}
                                ></div>
                              </div>
                              <p className="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">
                                {achievement.progress} / {achievement.target}
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6 text-center">
                  <button className="px-4 py-2 text-sm font-medium text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200">
                    View All Achievements
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
              </div>
              <div className="p-6">
                <div className="flow-root">
                  <ul className="-mb-8">
                    {recentActivity.map((activity, activityIdx) => (
                      <li key={activity.id}>
                        <div className="relative pb-8">
                          {activityIdx !== recentActivity.length - 1 ? (
                            <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200 dark:bg-gray-700" aria-hidden="true" />
                          ) : null}
                          <div className="relative flex space-x-3">
                            <div>
                              <span className={`h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white dark:ring-gray-800 ${
                                activity.type === 'game' ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300' :
                                activity.type === 'grade' ? 'bg-green-100 dark:bg-green-900 text-green-600 dark:text-green-300' :
                                activity.type === 'prize' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-600 dark:text-yellow-300' :
                                'bg-purple-100 dark:bg-purple-900 text-purple-600 dark:text-purple-300'
                              }`}>
                                {activity.icon}
                              </span>
                            </div>
                            <div className="flex min-w-0 flex-1 justify-between space-x-4 pt-1.5">
                              <div>
                                <p className="text-sm text-gray-800 dark:text-gray-200">
                                  {activity.description}
                                </p>
                              </div>
                              <div className="whitespace-nowrap text-right text-sm text-gray-500 dark:text-gray-400">
                                {activity.timestamp}
                              </div>
                            </div>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6">
                  <button className="w-full px-4 py-2 text-sm font-medium text-center text-primary hover:text-primary-dark dark:text-primary-300 dark:hover:text-primary-200 border border-dashed border-gray-300 dark:border-gray-600 rounded-lg hover:border-gray-400 dark:hover:border-gray-500">
                    View All Activity
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Stats */}
            <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Stats</h2>
              </div>
              <div className="p-6">
                <dl className="space-y-6">
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">Sep 2023</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Logins</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">42</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Current Streak</dt>
                    <div className="flex items-center">
                      <span className="text-sm font-medium text-gray-900 dark:text-white mr-2">7 days</span>
                      <span className="h-2 w-2 rounded-full bg-green-500"></span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Favorite Game</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">Blackjack</dd>
                  </div>
                  <div className="flex items-center justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400">Highest Score</dt>
                    <dd className="text-sm font-medium text-gray-900 dark:text-white">1,250</dd>
                  </div>
                </dl>
                <div className="mt-6">
                  <button className="w-full px-4 py-2 text-sm font-medium text-center text-white bg-primary hover:bg-primary-dark rounded-lg transition-colors">
                    View Full Statistics
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
