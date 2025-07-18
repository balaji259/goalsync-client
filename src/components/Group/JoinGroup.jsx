import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';

function JoinGroup() {
  const [groups, setGroups] = useState([]);
  const [selected, setSelected] = useState(null);
  const [joinCode, setJoinCode] = useState('');

  const { theme } = useSelector((state) => state.theme);

  const getGroups = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await api.get('/api/groups/all', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setGroups(response.data);
    } catch (e) {
      console.error(e.message);
    }
  };

  useEffect(() => {
    getGroups();
  }, []);

  const join = async () => {
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
    alert('Request sent or joined!');
    setSelected(null);
  };

  return (
    <div
      className={`min-h-screen p-4 transition-all ${
        theme === 'dark' ? 'bg-[#0f172a] text-white' : 'bg-gray-100 text-black'
      }`}
    >
      <h2 className="text-2xl font-semibold mb-4 text-center">Join a Group</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {groups.map((g) => (
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
              theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-black'
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

            <button
              onClick={join}
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
            >
              Join Group
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default JoinGroup;
