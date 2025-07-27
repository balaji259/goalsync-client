// src/pages/Profile.jsx
import React, { useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import api from './api/api';

const Profile = () => {
  const { user, token } = useSelector((s) => s.auth);
  const { theme } = useSelector((s) => s.theme);

  const [profile, setProfile] = useState(null);
  const [groupsCount, setGroupsCount] = useState(0);
  const [goalsCount, setGoalsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    bio: '',
    location: '',
    interests: '',
  });

  const dark = theme === 'dark';

  const containerCls = useMemo(
    () =>
      `min-h-screen transition-colors duration-300 ${
        dark ? 'bg-[#0f172a] text-slate-100' : 'bg-gray-100 text-slate-900'
      }`,
    [dark]
  );

  const cardCls = useMemo(
    () =>
      `rounded-xl shadow-md p-5 transition-colors duration-300 ${
        dark ? 'bg-[#1e293b] text-slate-100' : 'bg-white text-slate-900'
      }`,
    [dark]
  );

  const badgeCls = useMemo(
    () =>
      `inline-flex items-center px-3 py-1 text-sm rounded-full ${
        dark
          ? 'bg-slate-700 text-slate-200 hover:bg-slate-600'
          : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
      }`,
    [dark]
  );

  const subtleText = dark ? 'text-slate-400' : 'text-slate-500';

  const getMe = async () => {
    try {
      const res = await api.get('/api/users/getprofile', {
        headers: { Authorization: `Bearer ${token}` },
      });
      // Shape expected:
      // {
      //   name, email, profile: { bio, avatar, interests: [..], location },
      //   goals: [..]
      // }
      console.log("response");
      console.log(res.data);
      setProfile(res.data);
      setGoalsCount(res.data?.goals?.length || 0);
    } catch (e) {
      console.error(e);
    }
  };

  const getMyGroups = async () => {
    try {
      const res = await api.get('/api/groups/my-groups', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGroupsCount(res.data?.length || 0);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (!user || !token) return;
    (async () => {
      setLoading(true);
      await Promise.all([getMe(), getMyGroups()]);
      setLoading(false);
    })();
  }, [user, token]);

  // -------- Edit Profile --------
  const openEdit = () => {
    setEditForm({
      bio: profile?.profile?.bio || '',
      location: profile?.profile?.location || '',
      interests: (profile?.profile?.interests || []).join(', '),
    });
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm((p) => ({ ...p, [name]: value }));
  };

  const saveProfile = async () => {
    try {
      const payload = {
        bio: editForm.bio,
        location: editForm.location,
        interests: editForm.interests
          .split(',')
          .map((t) => t.trim().toLowerCase())
          .filter(Boolean),
      };
      const res = await api.put('/api/users/update-profile', payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile((prev) => ({
        ...prev,
        profile: {
          ...(prev?.profile || {}),
          ...res.data.profile, 
        },
      }));
      setIsEditOpen(false);
    } catch (e) {
      console.error(e);
    }
  };

  // --------- Skeletons ----------
  const Skeleton = ({ className = '' }) => (
    <div
      className={`animate-pulse rounded-md ${
        dark ? 'bg-slate-700/50' : 'bg-slate-200'
      } ${className}`}
    />
  );

  return (
    <div className={containerCls}>
      {/* Hero */}
      <div className="relative overflow-hidden">
        {/* Gradient blobs */}
        <motion.div
          className="absolute -top-32 -left-32 h-80 w-80 rounded-full blur-3xl opacity-40"
          style={{
            background: dark
              ? 'radial-gradient(circle at 30% 30%, #6366f1, #0f172a)'
              : 'radial-gradient(circle at 30% 30%, #60a5fa, #f1f5f9)',
          }}
          animate={{ scale: [1, 1.2, 1], rotate: [0, 20, 0] }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute -bottom-20 -right-20 h-96 w-96 rounded-full blur-3xl opacity-30"
          style={{
            background: dark
              ? 'radial-gradient(circle at 70% 70%, #22c55e, #0f172a)'
              : 'radial-gradient(circle at 70% 70%, #34d399, #f1f5f9)',
          }}
          animate={{ scale: [1.1, 0.9, 1.1], rotate: [0, -15, 0] }}
          transition={{ duration: 12, repeat: Infinity }}
        />

        <div className="relative max-w-5xl mx-auto px-6 pt-20 pb-16">
          {loading ? (
          <>
            <Skeleton className="h-24 w-24 rounded-full mb-4" />
            <Skeleton className="h-6 w-48 mb-2" />
            <Skeleton className="h-4 w-60 mb-1" />
            <Skeleton className="h-4 w-40" />
          </>
          ) : (
            <>
              {/* Avatar */}
              <motion.div
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative inline-block"
              >
                <div className="h-24 w-24 rounded-full ring-4 ring-offset-2 ring-offset-transparent ring-blue-500 overflow-hidden">
                  {profile?.profile?.avatar ? (
                    <img
                      src={profile.profile.avatar}
                      alt={profile?.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div
                      className={`h-full w-full flex items-center justify-center text-4xl font-semibold ${
                        dark ? 'bg-slate-700' : 'bg-slate-200'
                      }`}
                    >
                      {(profile?.name || 'U')[0]?.toUpperCase()}
                    </div>
                  )}
                </div>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1, duration: 0.4 }}
                className="mt-4 text-3xl md:text-4xl font-bold"
              >
                {profile?.name}
              </motion.h1>

              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15, duration: 0.4 }}
                className={`mt-1 text-sm ${subtleText}`}
              >
                <span className="break-all">{profile?.email}</span>
              </motion.div>

              {profile?.profile?.location && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className={`mt-1 text-sm ${subtleText}`}
                >
                  📍 {profile.profile.location}
                </motion.div>
              )}

              <motion.button
                onClick={openEdit}
                whileTap={{ scale: 0.97 }}
                className={`mt-6 px-4 py-2 rounded-lg font-medium ${
                  dark
                    ? 'bg-blue-600 hover:bg-blue-500'
                    : 'bg-blue-600 hover:bg-blue-700'
                } text-white shadow`}
              >
                Edit Profile
              </motion.button>
            </>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative max-w-5xl mx-auto px-6 pb-24 -mt-10 space-y-6">
        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 ${cardCls}`}
        >
          {loading ? (
            <>
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
              <Skeleton className="h-16" />
            </>
          ) : (
            <>
              <Stat title="Goals" value={goalsCount} />
              <Stat title="Groups" value={groupsCount} />
              <Stat
                title="Interests"
                value={profile?.profile?.interests?.length || 0}
              />
              <Stat
                title="Joined"
                value={new Date(profile?.createdAt).toLocaleDateString()}
              />
            </>
          )}
        </motion.div>

        {/* Bio */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className={cardCls}
        >
          <h2 className="text-lg font-semibold mb-2">About</h2>
          {loading ? (
            <>
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-2/3 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </>
          ) : profile?.profile?.bio ? (
            <p className="leading-relaxed">{profile.profile.bio}</p>
          ) : (
            <p className={subtleText}>No bio yet. Tell people about yourself.</p>
          )}
        </motion.div>

        {/* Interests */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className={cardCls}
        >
          <div className="flex items-center justify-between mb-3">
          <h2 className="text-lg font-semibold">Interests</h2>
          {!loading && (
            <button
              onClick={openEdit}
              className={`text-sm underline ${
                dark ? 'text-slate-300' : 'text-slate-600'
              }`}
            >
              Edit
            </button>
          )}
          </div>
          {loading ? (
            <div className="flex flex-wrap gap-2">
              <Skeleton className="h-6 w-20" />
              <Skeleton className="h-6 w-24" />
              <Skeleton className="h-6 w-16" />
            </div>
          ) : profile?.profile?.interests?.length ? (
            <div className="flex flex-wrap gap-2">
              {profile.profile.interests.map((i, idx) => (
                <span key={idx} className={badgeCls}>
                  #{i}
                </span>
              ))}
            </div>
          ) : (
            <p className={subtleText}>No interests added.</p>
          )}
        </motion.div>

        {/* Goals preview */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.15 }}
          className={cardCls}
        >
          <h2 className="text-lg font-semibold mb-3">Recent Goals</h2>
          {loading ? (
            <>
              <Skeleton className="h-5 w-1/2 mb-2" />
              <Skeleton className="h-5 w-2/3 mb-2" />
              <Skeleton className="h-5 w-1/3" />
            </>
          ) : goalsCount === 0 ? (
            <p className={subtleText}>You haven’t added any goals yet.</p>
          ) : (
            <ul className="space-y-2">
              {(profile?.goals || []).slice(0, 5).map((g) => (
                <li
                  key={g._id}
                  className={`text-sm p-3 rounded-md ${
                    dark ? 'bg-slate-700/40' : 'bg-slate-100'
                  }`}
                >
                  <p className="font-medium">{g.title || 'Untitled Goal'}</p>
                  {g.description && (
                    <p className={`text-xs mt-1 ${subtleText}`}>
                      {g.description}
                    </p>
                  )}
                </li>
              ))}
              {goalsCount > 5 && (
                <p className={`text-sm mt-2 ${subtleText}`}>
                  +{goalsCount - 5} more…
                </p>
              )}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Edit Modal */}
      <AnimatePresence>
        {isEditOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Backdrop */}
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setIsEditOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* Dialog */}
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              transition={{ type: 'spring', stiffness: 220, damping: 20 }}
              className={`relative z-10 w-full max-w-lg rounded-xl p-6 shadow-xl ${
                dark ? 'bg-[#1e293b] text-slate-100' : 'bg-white text-slate-900'
              }`}
            >
              <h3 className="text-xl font-semibold mb-4">Edit Profile</h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm mb-1">Bio</label>
                  <textarea
                    name="bio"
                    rows={3}
                    value={editForm.bio}
                    onChange={handleEditChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring ${
                      dark
                        ? 'bg-slate-800 border-slate-700 focus:ring-blue-500'
                        : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">Location</label>
                  <input
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring ${
                      dark
                        ? 'bg-slate-800 border-slate-700 focus:ring-blue-500'
                        : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-sm mb-1">
                    Interests (comma separated)
                  </label>
                  <input
                    name="interests"
                    value={editForm.interests}
                    onChange={handleEditChange}
                    placeholder="webdev, fitness, uiux"
                    className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring ${
                      dark
                        ? 'bg-slate-800 border-slate-700 focus:ring-blue-500'
                        : 'bg-white border-slate-300 focus:ring-blue-500'
                    }`}
                  />
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={() => setIsEditOpen(false)}
                  className={`px-4 py-2 rounded-md ${
                    dark
                      ? 'bg-slate-700 hover:bg-slate-600'
                      : 'bg-slate-200 hover:bg-slate-300'
                  }`}
                >
                  Cancel
                </button>
                <button
                  onClick={saveProfile}
                  className="px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const Stat = ({ title, value }) => {
  return (
    <div className="flex flex-col items-center justify-center py-3">
      <div className="text-2xl font-bold">{value}</div>
      <div className="text-sm opacity-70">{title}</div>
    </div>
  );
};

export default Profile;
