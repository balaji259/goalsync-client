// src/components/Navbar.jsx
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTheme } from '../redux/themeSlice';
import { logout } from '../redux/authSlice';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Navbar = () => {
  const dispatch = useDispatch();
  const { theme } = useSelector((state) => state.theme);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

const handleLogout = () => {
  try {
    dispatch(logout());
    navigate("/");
  } catch (e) {
    console.log(e.message);
    toast.error("Logout failed! Please try again");
  }
};

  return (
    <nav className={`p-4 flex justify-between ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-white text-black'}`}>
      <h1>GoalSync</h1>
      <div className="flex items-center gap-4">
        <button onClick={() => dispatch(toggleTheme())}>
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
        {isAuthenticated && (
         <>
          {/* <span>{user?.name}</span> */}
          <span className="cursor-pointer" onClick={() => {navigate("/pending")}}>🔔</span>
          <button onClick={handleLogout}>Logout</button>
        </>
      )}

      </div>
    </nav>
  );
};

export default Navbar;
