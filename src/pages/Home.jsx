import { useState, useContext } from 'react';
import { motion } from 'framer-motion';
import { AppContext } from '../App';
import { toast } from 'react-hot-toast';

const Home = () => {
  const { user, addGrade } = useContext(AppContext);
  const [assignmentName, setAssignmentName] = useState('');
  const [grade, setGrade] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const gradeValue = parseFloat(grade);
    
    if (isNaN(gradeValue) || gradeValue < 0 || gradeValue > 100) {
      toast.error('Please enter a valid grade between 0 and 100');
      setIsSubmitting(false);
      return;
    }

    if (!assignmentName.trim()) {
      toast.error('Please enter an assignment name');
      setIsSubmitting(false);
      return;
    }

    // Add a small delay for better UX
    setTimeout(() => {
      const chipsEarned = addGrade(assignmentName, gradeValue);
      
      if (chipsEarned > 0) {
        toast.success(
          `🎉 Congratulations! You earned ${chipsEarned} ${chipsEarned === 1 ? 'chip' : 'chips'}!`,
          { duration: 4000 }
        );
      } else {
        toast('Keep working hard! You need 90% or above to earn chips.', {
          icon: '📚',
          duration: 4000,
        });
      }
      
      setAssignmentName('');
      setGrade('');
      setIsSubmitting(false);
    }, 800);
  };

  // Calculate statistics
  const totalGrades = user.grades.length;
  const averageGrade = totalGrades > 0 
    ? (user.grades.reduce((sum, grade) => sum + grade.grade, 0) / totalGrades).toFixed(1)
    : 0;
  
  const totalChipsEarned = user.grades.reduce((sum, grade) => sum + grade.chipsEarned, 0);

  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-2xl">
        <motion.h1 
          className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Welcome to <span className="text-gradient">GradeJack</span>
        </motion.h1>
        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Turn your academic achievements into chips and win exciting prizes by playing Blackjack!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Grade Input Card */}
        <motion.div 
          className="bg-white dark:bg-card-dark rounded-xl shadow-md p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-white">Enter Your Grade</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="assignment" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Assignment Name
              </label>
              <input
                type="text"
                id="assignment"
                value={assignmentName}
                onChange={(e) => setAssignmentName(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., Midterm Exam"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="grade" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Grade (%)
              </label>
              <input
                type="number"
                id="grade"
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                min="0"
                max="100"
                step="0.1"
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="e.g., 92.5"
                disabled={isSubmitting}
              />
            </div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full btn btn-primary flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : (
                'Submit Grade'
              )}
            </button>
          </form>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-2">Chip Rewards</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• 100% = 10 chips</li>
              <li>• 98-99% = 7 chips</li>
              <li>• 95-97% = 5 chips</li>
              <li>• 90-94% = 2 chips</li>
              <li>• Below 90% = No chips</li>
            </ul>
          </div>
        </motion.div>

        {/* Stats Card */}
        <motion.div 
          className="md:col-span-2 bg-white dark:bg-card-dark rounded-xl shadow-md p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3 }}
        >
          <h2 className="text-xl font-semibold mb-6 text-gray-800 dark:text-white">Your Stats</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* User Stats */}
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-primary/10 to-primary/5 dark:from-primary/20 dark:to-primary/10 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Chips</p>
                <p className="text-3xl font-bold text-primary-600 dark:text-primary-400">{user.chips}</p>
              </div>
              
              <div className="bg-gradient-to-r from-secondary/10 to-secondary/5 dark:from-secondary/20 dark:to-secondary/10 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Tokens</p>
                <p className="text-3xl font-bold text-secondary-600 dark:text-secondary-400">{user.tokens}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Games Played</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{user.gamesPlayed}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Win Rate</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {user.gamesPlayed > 0 
                    ? Math.round((user.gamesWon / user.gamesPlayed) * 100) 
                    : 0}%
                </p>
              </div>
            </div>
            
            {/* Grade Stats */}
            <div className="space-y-4">
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Grades</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalGrades}</p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Average Grade</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {averageGrade}%
                </p>
              </div>
              
              <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                <p className="text-sm text-gray-500 dark:text-gray-400">Total Chips Earned</p>
                <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">
                  {totalChipsEarned}
                </p>
              </div>
              
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-amber-900/20 dark:to-amber-800/20 p-4 rounded-lg">
                <p className="text-sm text-amber-600 dark:text-amber-400">Current Streak</p>
                <p className="text-2xl font-bold text-amber-700 dark:text-amber-300">
                  {user.grades.length > 0 && user.grades[user.grades.length - 1].grade >= 90 
                    ? '🔥 Active' 
                    : '—'}
                </p>
              </div>
            </div>
          </div>
          
          {/* Recent Grades */}
          {user.grades.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 dark:text-gray-300 mb-3">Recent Grades</h3>
              <div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-800">
                    <tr>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Assignment
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Grade
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Chips
                      </th>
                      <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-700">
                    {[...user.grades].reverse().slice(0, 3).map((grade, index) => (
                      <tr key={index}>
                        <td className="px-4 py-3 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                          {grade.name}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            grade.grade >= 90 
                              ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                              : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                          }`}>
                            {grade.grade}%
                          </span>
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {grade.chipsEarned > 0 ? (
                            <span className="inline-flex items-center">
                              🎴 {grade.chipsEarned}
                            </span>
                          ) : (
                            '—'
                          )}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {new Date(grade.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              {user.grades.length > 3 && (
                <div className="mt-2 text-right">
                  <button 
                    onClick={() => {/* TODO: Navigate to grades history */}}
                    className="text-sm text-primary-600 hover:text-primary-800 dark:text-primary-400 dark:hover:text-primary-300"
                  >
                    View all grades →
                  </button>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <motion.div 
          className="bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20 p-6 rounded-xl shadow-sm border border-primary/20 dark:border-primary/30"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-primary/10 dark:bg-primary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary-600 dark:text-primary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">How It Works</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Learn how to earn chips and win prizes</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-secondary/5 to-secondary/10 dark:from-secondary/10 dark:to-secondary/20 p-6 rounded-xl shadow-sm border border-secondary/20 dark:border-secondary/30"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-secondary/10 dark:bg-secondary/20">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-secondary-600 dark:text-secondary-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Leaderboard</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">See how you rank against other students</p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="bg-gradient-to-r from-amber-50 to-amber-100 dark:from-amber-900/30 dark:to-amber-900/20 p-6 rounded-xl shadow-sm border border-amber-100 dark:border-amber-900/30"
          whileHover={{ y: -5, transition: { duration: 0.2 } }}
        >
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-amber-600 dark:text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Prize Shop</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Redeem your tokens for awesome prizes</p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
