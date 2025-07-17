import React, { useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import api from './api/api'

const AuthPage = () => {
  const [isSignup, setIsSignup] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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

  try {
    const endpoint = isSignup ? 'register' : 'login';
    const data = isSignup
      ? formData
      : { email: formData.email, password: formData.password };

    console.log(`${isSignup ? 'Signup' : 'Login'} submitted:`, data);

    const response = await api.post(`/api/auth/${endpoint}`, data);

    console.log('Server response:', response.data);

    localStorage.setItem('token',response.data.token);

    // Optional: handle success (e.g., navigate, show message)
  } catch (error) {
    console.error('Submission error:', error.response?.data || error.message);
    // Optional: show error message to user
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
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-blue-50 flex items-center justify-center p-4">
      <div className="relative w-full max-w-4xl h-[500px] bg-white rounded-2xl shadow-2xl overflow-hidden flex">

        {/* Left Content */}
        <div className={`w-1/2 p-8 flex flex-col justify-center z-20 transition-transform duration-700 ${isSignup ? '-translate-x-full' : 'translate-x-0'}`}>
          <div className="w-full max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign In</h3>
            <div className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
              <a href="#" className="text-blue-500 hover:text-blue-600 text-sm transition-colors duration-300">
                Forgot password?
              </a>
            </div>
          </div>
        </div>

        {/* Right Content */}
        <div className={`w-1/2 p-8 flex flex-col justify-center absolute top-0 h-full transition-transform duration-700 z-30 bg-white ${isSignup ? 'translate-x-0 left-1/2' : 'translate-x-full left-1/2'}`}>
          <div className="w-full max-w-sm mx-auto">
            <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Sign Up</h3>
            <div className="space-y-4">
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
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
              <p className="text-xs text-gray-500">
                By signing up, you agree to our Terms and Privacy Policy
              </p>
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="absolute inset-0 z-10 pointer-events-none">
          <div className={`absolute inset-y-0 left-1/2 w-1/2 bg-gradient-to-br from-blue-500 to-purple-600 transition-transform duration-700 ${isSignup ? '-translate-x-full' : 'translate-x-0'}`}>
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
    </div>
  );
};

export default AuthPage;
