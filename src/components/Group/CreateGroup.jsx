import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../api/api';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

function CreateGroup() {
  const [form, setForm] = useState({
    name: '',
    type: 'public',
    joinCode: '',
    maxMembers: 10,
  });

  const { theme } = useSelector((state) => state.theme);
  const isDarkMode = theme === 'dark';
  const navigate = useNavigate();

  const handleCreate = async () => {
    if (!form.name.trim()) {
      toast.error('Group name is required', {duration : 2000});
      return;
    }

    if (!form.maxMembers || form.maxMembers <= 0) {
      toast.error('Max members must be a positive number', {duration : 2000});
      return;
    }

    if (form.type === 'private' && !form.joinCode.trim()) {
      toast.error('Invite code is required for private groups', {duration: 2000});
      return;
    }

    try {
      const token = localStorage.getItem('token');

      await api.post('/api/groups/create', form, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast.success('Group created!', {duration: 2000});
      setForm({
        name: '',
        type: 'public',
        joinCode: '',
        maxMembers: 10,
      });
      navigate(-1);
    } catch (err) {
      toast.error('Error creating group', {duration : 2000 });
    }
  };

  // Theme-based styles
  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const inputBg = isDarkMode ? 'bg-gray-700' : 'bg-white';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : 'placeholder-gray-500';

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${bgMain}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-md space-y-4 transition-all duration-300 ${bgCard}`}>
        <h2 className={`text-2xl font-semibold text-center ${textColor}`}>Create Group</h2>

        <input
          type="text"
          placeholder="Group name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${inputBg} ${textColor} ${borderColor} ${placeholderColor}`}
        />

        <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value, joinCode: '' })}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${inputBg} ${textColor} ${borderColor}`}
        >
          <option className="bg-white text-black dark:bg-gray-700 dark:text-white" value="public">Public</option>
          <option className="bg-white text-black dark:bg-gray-700 dark:text-white" value="private">Private (Invite Code)</option>
          <option className="bg-white text-black dark:bg-gray-700 dark:text-white" value="approval">Approval Needed</option>
        </select>

        {form.type === 'private' && (
          <input
            type="text"
            placeholder="Enter custom invite code"
            value={form.joinCode}
            onChange={e => setForm({ ...form, joinCode: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${inputBg} ${textColor} ${borderColor} ${placeholderColor}`}
          />
        )}

        <input
          type="number"
          placeholder="Max members (default 10)"
          value={form.maxMembers}
          onChange={e => setForm({ ...form, maxMembers: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${inputBg} ${textColor} ${borderColor} ${placeholderColor}`}
        />

        <button
          onClick={handleCreate}
          className="w-full py-2 mt-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-md transition duration-300"
        >
          Create
        </button>
      </div>
    </div>
  );
}

export default CreateGroup;
