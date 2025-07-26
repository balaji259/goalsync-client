import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from './api/api';
import { loginSuccess } from '../redux/authSlice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { theme } = useSelector((state) => state.theme);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isSignup) {
      if (!formData.name || !formData.email || !formData.password) {
        return toast.error('All fields are required', {duration:2000});
      }
      if (formData.password !== formData.confirmPassword) {
        return toast.error('Passwords do not match',{duration:2000});
      }
    }

    try {
      const endpoint = isSignup ? 'register' : 'login';
      const data = isSignup
        ? formData
        : { email: formData.email, password: formData.password };

      const response = await api.post(`/api/auth/${endpoint}`, data);
      localStorage.setItem('token', response.data.token);

      dispatch(
        loginSuccess({
          token: response.data.token,
          user: response.data.user,
        })
      );

      toast.success(`${isSignup ? "Registration" : "Login"} Successful!`,{duration: 2000});
      navigate("/home");

    } catch (error) {
      toast.error('Submission error:', error.response?.data || error.message,{duration:2000});
    }
  };

  const toggleMode = () => {
    setIsSignup(!isSignup);
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 transition-all ${
        theme === 'dark' ? 'bg-[#0f172a]' : 'bg-gradient-to-br from-slate-100 to-blue-50'
      }`}
    >
      {/* Desktop Layout */}
      <div
        className={`hidden md:flex relative w-full max-w-4xl h-[500px] overflow-hidden rounded-2xl shadow-2xl transition-all ${
          theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-black'
        }`}
      >
        {/* Left Content - Desktop */}
        <div className={`w-1/2 p-8 flex flex-col justify-center z-20 transition-transform duration-700 ${isSignup ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="w-full max-w-sm mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Sign In</h3>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Sign In
              </button>
            </div>

            <div className="mt-4 text-center">
              <a href="#" className="text-blue-400 hover:text-blue-500 text-sm transition-colors duration-300">
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        {/* Right Content - Desktop */}
        <div className={`w-1/2 p-8 flex flex-col justify-center absolute top-0 h-full transition-transform duration-700 z-30 ${
          theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-black'
        } ${isSignup ? 'translate-x-0 left-1/2' : 'translate-x-full left-1/2'}`}>
          <div className="w-full max-w-sm mx-auto">
            <h3 className="text-2xl font-bold mb-6 text-center">Sign Up</h3>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>

              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>

              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-white border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-105 shadow-lg"
              >
                Create Account
              </button>
            </div>

            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400">
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Side Panel - Desktop */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className={`absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-700 ${
            isSignup ? '-translate-x-full' : 'translate-x-0'
          }`}>
            <div className="h-full flex items-center justify-center text-white p-6">
              <div className="text-center">
                <h2 className="text-3xl font-bold mb-4">
                  {isSignup ? 'Welcome!' : 'Hello Again!'}
                </h2>
                <p className="text-blue-100 mb-6">
                  {isSignup
                    ? 'Already have an account? Sign in to continue.'
                    : 'New here? Create an account to get started.'}
                </p>
                <button
                  onClick={toggleMode}
                  className="pointer-events-auto bg-white/20 hover:bg-white/30 text-white px-6 py-2 rounded-full border border-white/30 transition-all duration-300 hover:scale-105"
                >
                  {isSignup ? 'Sign In' : 'Sign Up'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div
        className={`md:hidden w-full max-w-sm mx-auto rounded-2xl shadow-2xl transition-all ${
          theme === 'dark' ? 'bg-[#1e293b] text-white' : 'bg-white text-black'
        }`}
      >
        <div className="p-6 sm:p-8">
          {/* Mobile Header */}
          <div className="text-center mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <User className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold mb-2">
              {isSignup ? 'Create Account' : 'Welcome Back'}
            </h2>
            <p className="text-gray-500 text-sm">
              {isSignup ? 'Sign up to get started' : 'Sign in to your account'}
            </p>
          </div>

          {/* Mobile Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignup && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-gray-50 border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>
            )}

            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                    : 'bg-gray-50 border-gray-200 text-black focus:ring-blue-500'
                } focus:outline-none focus:ring-2 transition-all duration-300`}
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className={`w-full pl-10 pr-10 py-3 rounded-lg border ${
                  theme === 'dark'
                    ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                    : 'bg-gray-50 border-gray-200 text-black focus:ring-blue-500'
                } focus:outline-none focus:ring-2 transition-all duration-300`}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
              </button>
            </div>

            {isSignup && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`w-full pl-10 pr-4 py-3 rounded-lg border ${
                    theme === 'dark'
                      ? 'bg-[#334155] border-gray-600 text-white placeholder-gray-300 focus:ring-blue-400'
                      : 'bg-gray-50 border-gray-200 text-black focus:ring-blue-500'
                  } focus:outline-none focus:ring-2 transition-all duration-300`}
                />
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-3 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-700 transform transition-all duration-300 hover:scale-[1.02] shadow-lg text-base"
            >
              {isSignup ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          {!isSignup && (
            <div className="mt-4 text-center">
              <a href="#" className="text-blue-400 hover:text-blue-500 text-sm transition-colors duration-300">
                Forgot password?
              </a>
            </div>
          )}

          {isSignup && (
            <div className="mt-4 text-center">
              <p className="text-xs text-gray-400 px-4">
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            </div>
          )}

          {/* Mobile Toggle */}
          <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-600 text-center">
            <p className="text-gray-500 text-sm mb-3">
              {isSignup ? 'Already have an account?' : "Don't have an account?"}
            </p>
            <button
              onClick={toggleMode}
              className="text-blue-500 hover:text-blue-600 font-semibold text-sm transition-colors duration-300"
            >
              {isSignup ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
