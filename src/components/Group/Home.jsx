import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/api';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';


const Home = () => {
  const [groups, setGroups] = useState([]);
  const navigate = useNavigate();
  const { user, token } = useSelector((state) => state.auth);
  const { theme } = useSelector((state) => state.theme);

  const getMyGroups = async () => {
    try {
      const response = await api.get('/api/groups/my-groups', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (e) {
      console.log(e.message);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    getMyGroups();
  }, [user]);

  return (
    <div
      className={`min-h-screen p-6 transition-colors duration-300 ${
        theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-black'
      }`}
    >
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-2">
          Welcome back, {user?.name || 'User'} 👋
        </h1>
        <p className="text-base text-gray-400 dark:text-gray-300">
          Explore your groups and keep up with your goals!
        </p>
        <motion.img
          src="data:image/png;base64,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"
          alt="Coding Banner"
          className="mx-auto mt-6 rounded-lg shadow-lg w-full max-w-xl object-contain"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        />
      </motion.div>

      {/* Groups Section */}
      <div className="max-w-5xl mx-auto">
       
       <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">Your Groups</h2>
  <div className="space-x-2">
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded">Create</button>
    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded">Join</button>
  </div>
</div>

        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
          {groups.map((g) => (
            <motion.div
              key={g._id}
              onClick={() => navigate(`/group/${g._id}`)}
              className={`p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition ${
                theme === 'dark'
                  ? 'bg-[#1e293b] text-white hover:bg-[#334155]'
                  : 'bg-white text-black hover:bg-gray-100'
              }`}
              whileHover={{ scale: 1.03 }}
            >
              <h3 className="text-lg font-bold">{g.name}</h3>
              <p className="text-sm text-gray-400 dark:text-gray-300">
                {g.description || 'No description'}
              </p>
            </motion.div>
          ))}
          {groups.length === 0 && (
            <p className="col-span-full text-center text-gray-400 mt-8">
              No groups found.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
