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
    Track your progress — one goal at a time
  </p>

  {/* Animated “progress ring + check-mark” */}
  <motion.svg
    width={220}
    height={220}
    viewBox="0 0 220 220"
    className="mx-auto mt-6"
    initial="hidden"
    animate="visible"
  >
    {/* Progress circle */}
    <motion.circle
      cx="110"
      cy="110"
      r="90"
      fill="transparent"
      stroke="#3b82f6"
      strokeWidth="12"
      strokeLinecap="round"
      variants={{
        hidden: { pathLength: 0 },
        visible: {
          pathLength: 1,
          transition: { duration: 2, ease: 'easeInOut' }
        }
      }}
    />

    {/* Check-mark — starts after the ring finishes */}
    <motion.path
      d="M70 115 L100 145 L150 85"
      fill="transparent"
      stroke="#22c55e"
      strokeWidth="12"
      strokeLinecap="round"
      variants={{
        hidden: { pathLength: 0 },
        visible: {
          pathLength: 1,
          transition: { delay: 2.1, duration: 0.8, ease: 'easeInOut' }
        }
      }}
    />
  </motion.svg>
</motion.div>





      {/* Groups Section */}
      <div className="max-w-5xl mx-auto">
       
       <div className="flex justify-between items-center mb-4">
  <h2 className="text-xl font-semibold">Your Groups</h2>
  <div className="space-x-2">
    <button className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded" onClick={()=> {navigate("/create")}}>Create</button>
    <button className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded" onClick={()=> {navigate("/join")}}>Join</button>
     <button className="bg-purple-500 hover:bg-purple-600 text-white px-3 py-1 rounded" onClick={()=> {navigate("/find-match")}}>Find-match</button>

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
