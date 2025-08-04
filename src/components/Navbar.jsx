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

  const firstLetter = user?.name ? user.name[0].toUpperCase() : 'U';

  const pendingCount = useSelector((state) => state.approval.pendingRequestsCount);



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
      <h1 onClick={() => navigate('/home')} className="text-lg md:text-xl font-bold cursor-pointer transition-all duration-300 transform hover:scale-105 hover:text-blue-500">GoalSync</h1>
      <div className="flex items-center gap-4">
        <button className="cursor-pointer" onClick={() => dispatch(toggleTheme())}>
          {theme === 'dark' ? '🌞 Light' : '🌙 Dark'}
        </button>
        {isAuthenticated && (
         <>
          {/* <span>{user?.name}</span> */}
          {/* <span className="cursor-pointer" onClick={() => {navigate("/pending")}}>🔔</span> */}
          <div className="relative cursor-pointer" onClick={() => navigate('/pending')}>
            <span>🔔</span>
            {pendingCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5">
                {pendingCount}
              </span>
            )}
          </div>
          <div
              onClick={() => navigate('/profile')}
              className={`h-8 w-8 flex items-center justify-center rounded-full cursor-pointer font-bold text-sm ${
                theme === 'dark'
                  ? 'bg-gray-700 text-white hover:bg-gray-600'
                  : 'bg-gray-300 text-black hover:bg-gray-400'
              }`}
              title="Profile"
            >
              {firstLetter}
            </div>
          <button onClick={handleLogout}className="cursor-pointer">Logout</button>
        </>
      )}

      </div>
    </nav>
  );
};

export default Navbar;
