import React, { useState } from 'react';
import axios from 'axios';
import api from '../api/api';


function CreateGroup() {
  const [form, setForm] = useState({
    name: '',
    type: 'public',
    joinCode: '',
    maxMembers: 10,
  });

  const isDarkMode = false;

  const handleCreate = async () => {
    if (!form.name.trim()) {
      alert('Group name is required');
      return;
    }

    if (!form.maxMembers || form.maxMembers <= 0) {
      alert('Max members must be a positive number');
      return;
    }

    if (form.type === 'private' && !form.joinCode.trim()) {
      alert('Invite code is required for private groups');
      return;
    }

    try {

      const token=localStorage.getItem('token');
  
      await api.post('/api/groups/create', form, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

      alert('Group created!');
      setForm({
        name: '',
        type: 'public',
        joinCode: '',
        maxMembers: 10,
      });
    } catch (err) {
      alert('Error creating group');
    }
  };

  const bgMain = isDarkMode ? 'bg-gray-900' : 'bg-gray-100';
  const bgCard = isDarkMode ? 'bg-gray-800' : 'bg-white';
  const textColor = isDarkMode ? 'text-white' : 'text-gray-800';
  const borderColor = isDarkMode ? 'border-gray-600' : 'border-gray-300';
  const placeholderColor = isDarkMode ? 'placeholder-gray-400' : '';

  return (
    <div className={`min-h-screen flex items-center justify-center transition-colors duration-300 ${bgMain}`}>
      <div className={`w-full max-w-md p-6 rounded-xl shadow-md space-y-4 transition-all duration-300 ${bgCard}`}>
        <h2 className={`text-2xl font-semibold text-center ${textColor}`}>Create Group</h2>

        <input
          type="text"
          placeholder="Group name"
          value={form.name}
          onChange={e => setForm({ ...form, name: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColor} ${borderColor} ${placeholderColor}`}
          required
        />

        {/* <select
          value={form.type}
          onChange={e => setForm({ ...form, type: e.target.value, joinCode: '' })}
          className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColor} ${borderColor}`}
        > */}

      <select
  value={form.type}
  onChange={e => setForm({ ...form, type: e.target.value, joinCode: '' })}
  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
>

          <option value="public">Public</option>
          <option value="private">Private (Invite Code)</option>
          <option value="approval">Approval Needed</option>
        </select>

        {form.type === 'private' && (
          <input
            type="text"
            placeholder="Enter custom invite code"
            value={form.joinCode}
            onChange={e => setForm({ ...form, joinCode: e.target.value })}
            className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColor} ${borderColor} ${placeholderColor}`}
            required
          />
        )}

        <input
          type="text"
          placeholder="Max members (default 10)"
          value={form.maxMembers}
          onChange={e => setForm({ ...form, maxMembers: e.target.value })}
          className={`w-full px-4 py-2 border rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-blue-500 ${textColor} ${borderColor} ${placeholderColor}`}
          required
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
