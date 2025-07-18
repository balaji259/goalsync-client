// src/components/Navbar.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { logout } from '../redux/authSlice';

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className={`p-4 flex justify-between ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1>SyncStudy</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
        {isAuthenticated ? (
          <>
            <span>{user?.name}</span>
            <button onClick={() => dispatch(logout())}>Logout</button>
          </>
        ) : (
          <a href="/auth">Login</a>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
