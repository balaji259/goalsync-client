import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function JoinGroup() {
  const [groups, setGroups] = useState([]);
  const [filteredGroups, setFilteredGroups] = useState([]);
  const [search, setSearch] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selected, setSelected] = useState(null);
  const [joinCode, setJoinCode] = useState('');
  const [isJoining, setIsJoining] = useState(false);
  const navigate = useNavigate();

  const { theme } = useSelector((state) => state.theme);

  const getGroups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/groups/tojoin', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
      setFilteredGroups(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearch(value);
    if (value.trim() === '') {
      setFilteredGroups(groups);
      setShowDropdown(false);
    } else {
      const filtered = groups.filter((g) =>
        g.name.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredGroups(filtered);
      setShowDropdown(true);
    }
  };

  const handleSelectFromDropdown = (group) => {
    setSelected(group);
    setSearch(group.name);
    setShowDropdown(false);
  };

  const join = async (groupType) => {
    try {
      setIsJoining(true);
      const token = localStorage.getItem('token');
      await api.post(
        '/api/groups/join',
        { groupId: selected._id, joinCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (groupType === 'public' || groupType === 'private') {
        toast.success('Joined Successfully', { duration: 2000 });
      } else {
        toast.success('Request sent to group creator', { duration: 2000 });
      }

       setGroups((prev) => prev.filter((g) => g._id !== selected._id));
        setFilteredGroups((prev) => prev.filter((g) => g._id !== selected._id));

      setSelected(null);

      navigate(-1);

    } catch (e) {
      console.log(e.message);
      toast.error(e.message);
    } finally {
      setIsJoining(false);
    }
  };

  return (
    <div
      className={`min-h-screen p-4 transition-all ${
        theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Join a Group</h2>

      {/* Search Bar */}
      <div className="relative max-w-md mx-auto mb-6">
        <input
          type="text"
          placeholder="Search group by name..."
          value={search}
          onChange={handleSearchChange}
          onFocus={() => setShowDropdown(search.trim() !== '')}
          className={`w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring transition ${
            theme === 'dark'
              ? 'bg-[#1e293b] text-white border-gray-600 placeholder-gray-400'
              : 'bg-white text-black border-gray-300'
          }`}
        />
        {showDropdown && filteredGroups.length > 0 && (
          <ul
            className={`absolute z-10 w-full mt-1 max-h-60 overflow-y-auto rounded-lg shadow-lg border ${
              theme === 'dark'
                ? 'bg-[#1e293b] border-gray-600'
                : 'bg-white border-gray-300'
            }`}
          >
            {filteredGroups.map((g) => (
              <li
                key={g._id}
                onClick={() => handleSelectFromDropdown(g)}
                className={`px-4 py-2 cursor-pointer hover:bg-blue-500 hover:text-white ${
                  theme === 'dark' ? 'text-white' : 'text-black'
                }`}
              >
                {g.name}
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Groups Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {filteredGroups.map((g) => (
          <div
            key={g._id}
            className={`p-4 rounded-xl shadow hover:shadow-md transition cursor-pointer ${
              theme === 'dark'
                ? 'bg-[#1e293b] text-white'
                : 'bg-white text-black'
            }`}
            onClick={() => setSelected(g)}
          >
            <h3 className="text-xl font-bold">{g.name}</h3>
            <p className="capitalize">{g.type}</p>
            {g.maxMembers && (
              <p className="text-sm mt-1">Max Members: {g.maxMembers}</p>
            )}
          </div>
        ))}
      </div>

      {/* Modal Overlay */}
      {selected && (
        <div className="fixed inset-0 z-40 flex items-center justify-center">
          {/* Overlay Dim Background */}
          <div className="absolute inset-0 bg-black bg-opacity-30 backdrop-blur-[2.5px] transition-opacity duration-300" />

          {/* Modal Content */}
          <div
            className={`relative z-50 p-6 rounded-xl shadow-lg w-11/12 max-w-md animate-fadeIn transition-all ${
              theme === 'dark'
                ? 'bg-[#1e293b] text-white'
                : 'bg-white text-black'
            }`}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelected(null)}
              className={`absolute top-2 right-4 text-2xl hover:text-red-600 ${
                theme === 'dark' ? 'text-white' : 'text-gray-800'
              }`}
            >
              &times;
            </button>

            <h3 className="text-xl font-bold mb-4">{selected.name}</h3>
            <p className="mb-2">Type: {selected.type}</p>

            {selected.type === 'private' && (
              <input
                type="text"
                placeholder="Enter Join Code"
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value)}
                className={`w-full border rounded px-3 py-2 mb-4 focus:outline-none focus:ring ${
                  theme === 'dark'
                    ? 'bg-[#334155] text-white border-gray-600 placeholder-gray-300'
                    : 'bg-white text-black border-gray-300'
                }`}
              />
            )}

            {/* Join Button with Spinner */}
            <button
              onClick={() => join(selected.type)}
              disabled={isJoining}
              className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center justify-center ${
                isJoining ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isJoining ? (
                <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                'Join Group'
              )}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinGroup;
