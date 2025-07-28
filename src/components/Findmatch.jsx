import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from "./api/api";

const FindMatch = () => {
  const { user, token } = useSelector((state) => state.auth);
  const [manualInterest, setManualInterest] = useState('');
  const [matchedUsers, setMatchedUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState(null); // 'auto' or 'manual'

  const filterSelf = (users) => {
    return users.filter(u => u._id !== user._id);
  };

  const fetchAutoMatches = async () => {
    try {
      setLoading(true);
      setActiveMode('auto');
      const res = await api.get(`/api/match/auto`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatchedUsers(filterSelf(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchManualMatches = async () => {
    try {
      if (!manualInterest.trim()) return;
      setLoading(true);
      setActiveMode('manual');
      const res = await api.get(`/api/match/manual?interest=${manualInterest}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMatchedUsers(filterSelf(res.data));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-4xl mx-auto mt-10 text-gray-800 dark:text-gray-200">
      <h2 className="text-3xl font-bold text-center mb-6">Find Your Match</h2>

      <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
        <button
          onClick={fetchAutoMatches}
          className={`px-5 py-2 rounded font-medium transition-colors ${
            activeMode === 'auto'
              ? 'bg-blue-700 text-white'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          Auto Match (My Interests)
        </button>

        <div className="flex gap-2 w-full md:w-auto">
          <input
            type="text"
            value={manualInterest}
            onChange={(e) => setManualInterest(e.target.value)}
            placeholder="Enter interest"
            className="flex-1 px-3 py-2 rounded border dark:bg-gray-800 dark:border-gray-600 focus:outline-none focus:ring-2"
          />
          <button
            onClick={fetchManualMatches}
            className={`px-4 py-2 rounded font-medium transition-colors ${
              activeMode === 'manual'
                ? 'bg-green-700 text-white'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            Manual Match
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : matchedUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {matchedUsers.map((match) => (
            <div
              key={match._id}
              className="bg-white dark:bg-gray-800 p-4 rounded shadow hover:shadow-lg transition"
            >
              <h3 className="text-lg font-semibold">{match.name}</h3>
              <p className="text-sm mt-1">
                <span className="font-medium">Interests:</span>{" "}
                {match.profile?.interests?.join(', ') || 'None'}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                <span className="font-medium">Location:</span>{" "}
                {match.profile?.location || 'Unknown'}
              </p>
            </div>
          ))}
        </div>
      ) : activeMode && (
        <p className="text-center text-gray-500 mt-6">No matches found.</p>
      )}
    </div>
  );
};

export default FindMatch;
