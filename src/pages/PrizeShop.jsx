import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppContext } from '../App';
import { toast } from 'react-hot-toast';

const prizes = [
  {
    id: 1,
    name: 'CMU T-Shirt',
    description: 'Official Carnegie Mellon University t-shirt',
    price: 100,
    image: 'https://via.placeholder.com/200x200?text=CMU+T-Shirt',
    category: 'Apparel',
    stock: 50
  },
  {
    id: 2,
    name: 'Coffee Voucher',
    description: 'Free coffee at any campus coffee shop',
    price: 50,
    image: 'https://via.placeholder.com/200x200?text=Coffee+Voucher',
    category: 'Food & Drinks',
    stock: 100
  },
  {
    id: 3,
    name: 'CMU Sticker Pack',
    description: 'Set of 5 CMU-themed stickers',
    price: 20,
    image: 'https://via.placeholder.com/200x200?text=Sticker+Pack',
    category: 'Merchandise',
    stock: 200
  },
  {
    id: 4,
    name: 'Tech Store Voucher',
    description: '$10 off at the CMU Tech Store',
    price: 80,
    image: 'https://via.placeholder.com/200x200?text=Tech+Store+Voucher',
    category: 'Vouchers',
    stock: 30
  },
  {
    id: 5,
    name: 'Library Extended Hours',
    description: '24-hour access to the library for a week',
    price: 75,
    image: 'https://via.placeholder.com/200x200?text=Library+Access',
    category: 'Services',
    stock: 40
  },
  {
    id: 6,
    name: 'CMU Hoodie',
    description: 'Warm and comfortable CMU hoodie',
    price: 150,
    image: 'https://via.placeholder.com/200x200?text=CMU+Hoodie',
    category: 'Apparel',
    stock: 25
  },
  {
    id: 7,
    name: 'Meal Swipe',
    description: 'One free meal at any campus dining location',
    price: 60,
    image: 'https://via.placeholder.com/200x200?text=Meal+Swipe',
    category: 'Food & Drinks',
    stock: 75
  },
  {
    id: 8,
    name: 'Parking Pass',
    description: 'One week of free parking on campus',
    price: 90,
    image: 'https://via.placeholder.com/200x200?text=Parking+Pass',
    category: 'Services',
    stock: 15
  }
];

const categories = ['All', ...new Set(prizes.map(prize => prize.category))];

const PrizeShop = () => {
  const { user } = useContext(AppContext);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('price-asc');
  const [redeemingId, setRedeemingId] = useState(null);
  const [redeemedPrizes, setRedeemedPrizes] = useState(() => {
    const saved = localStorage.getItem('redeemedPrizes');
    return saved ? JSON.parse(saved) : [];
  });

  // Filter and sort prizes
  const filteredPrizes = prizes
    .filter(prize => {
      const matchesCategory = selectedCategory === 'All' || prize.category === selectedCategory;
      const matchesSearch = prize.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          prize.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'price-asc':
          return a.price - b.price;
        case 'price-desc':
          return b.price - a.price;
        case 'name-asc':
          return a.name.localeCompare(b.name);
        case 'name-desc':
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

  // Handle prize redemption
  const redeemPrize = (prize) => {
    if (user.tokens < prize.price) {
      toast.error('Not enough tokens to redeem this prize');
      return;
    }

    if (prize.stock <= 0) {
      toast.error('This prize is out of stock');
      return;
    }

    setRedeemingId(prize.id);
    
    // Simulate API call
    setTimeout(() => {
      const redemption = {
        id: Date.now(),
        prizeId: prize.id,
        name: prize.name,
        price: prize.price,
        date: new Date().toISOString(),
        status: 'Processing'
      };

      const updatedRedeemedPrizes = [...redeemedPrizes, redemption];
      setRedeemedPrizes(updatedRedeemedPrizes);
      localStorage.setItem('redeemedPrizes', JSON.stringify(updatedRedeemedPrizes));
      
      // In a real app, you would update the user's tokens via an API call
      // For now, we'll just show a success message
      toast.success(`Successfully redeemed ${prize.name} for ${prize.price} tokens!`);
      setRedeemingId(null);
      
      // Update prize stock (in a real app, this would be handled by the backend)
      prize.stock--;
    }, 1500);
  };

  // Check if a prize is already redeemed
  const isRedeemed = (prizeId) => {
    return redeemedPrizes.some(prize => prize.prizeId === prizeId);
  };

  // Filter redeemed prizes for the history tab
  const redeemedItems = redeemedPrizes.map(redemption => ({
    ...redemption,
    ...prizes.find(p => p.id === redemption.prizeId)
  })).reverse();

  return (
    <div className="py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <motion.h1 
            className="text-4xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            Prize Shop
          </motion.h1>
          <p className="text-xl text-gray-600 dark:text-gray-300">
            Redeem your tokens for amazing prizes!
          </p>
          <div className="mt-4 p-4 bg-gradient-to-r from-primary/10 to-secondary/10 dark:from-primary/20 dark:to-secondary/20 rounded-lg inline-block">
            <p className="text-2xl font-bold text-gray-800 dark:text-white">
              🪙 {user.tokens} Tokens Available
            </p>
          </div>
        </div>

        {/* Filters and Search */}
        <div className="mb-8 bg-white dark:bg-card-dark rounded-xl shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Category
              </label>
              <select
                id="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="sort" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Sort By
              </label>
              <select
                id="sort"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              >
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="name-asc">Name: A to Z</option>
                <option value="name-desc">Name: Z to A</option>
              </select>
            </div>
            <div>
              <label htmlFor="search" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Search Prizes
              </label>
              <div className="relative">
                <input
                  type="text"
                  id="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search by name or description..."
                  className="w-full px-4 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prizes Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-12">
          {filteredPrizes.length > 0 ? (
            filteredPrizes.map(prize => (
              <motion.div 
                key={prize.id}
                className="bg-white dark:bg-card-dark rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -5 }}
              >
                <div className="h-48 bg-gray-100 dark:bg-gray-700 overflow-hidden">
                  <img 
                    src={prize.image} 
                    alt={prize.name} 
                    className="w-full h-full object-cover"
                  />
                  {prize.stock < 10 && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                      Only {prize.stock} left!
                    </div>
                  )}
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{prize.name}</h3>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                      {prize.category}
                    </span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 flex-1">
                    {prize.description}
                  </p>
                  <div className="mt-auto">
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-gray-900 dark:text-white">
                        {prize.price} 🪙
                      </span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {prize.stock} in stock
                      </span>
                    </div>
                    <button
                      onClick={() => redeemPrize(prize)}
                      disabled={user.tokens < prize.price || prize.stock <= 0 || redeemingId === prize.id || isRedeemed(prize.id)}
                      className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${
                        isRedeemed(prize.id)
                          ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 cursor-default'
                          : user.tokens >= prize.price && prize.stock > 0
                          ? 'bg-gradient-to-r from-primary to-primary-dark hover:from-primary-dark hover:to-primary text-white'
                          : 'bg-gray-200 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {redeemingId === prize.id ? (
                        <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Processing...
                        </span>
                      ) : isRedeemed(prize.id) ? (
                        'Redeemed!'
                      ) : user.tokens >= prize.price ? (
                        'Redeem Now'
                      ) : (
                        'Not Enough Tokens'
                      )}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No prizes found</h3>
              <p className="mt-1 text-gray-500 dark:text-gray-400">Try adjusting your search or filter to find what you're looking for.</p>
            </div>
          )}
        </div>

        {/* Redemption History */}
        <div className="bg-white dark:bg-card-dark rounded-xl shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Redemption History</h2>
          </div>
          <div className="overflow-x-auto">
            {redeemedItems.length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Prize
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Date Redeemed
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Price
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white dark:bg-card-dark divide-y divide-gray-200 dark:divide-gray-700">
                  {redeemedItems.map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="flex-shrink-0 h-10 w-10">
                            <img className="h-10 w-10 rounded-full" src={item.image} alt={item.name} />
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{item.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{item.category}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                        {new Date(item.date).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                        {item.price} 🪙
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.status === 'Processing' 
                            ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200' 
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                        }`}>
                          {item.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-white">No redemption history</h3>
                <p className="mt-1 text-gray-500 dark:text-gray-400">Redeem a prize to see it here.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrizeShop;
