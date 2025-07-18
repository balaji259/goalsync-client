import React,{ useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css']

import AuthPage from './components/AuthForm';
import CreateGroup from './components/Group/CreateGroup';
import JoinGroup from './components/Group/JoinGroup';
import PendingRequests from './components/Group/PendingRequsts';

import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';




function App() {
  
  const { theme } = useSelector((state) => state.theme);


  return (

        <Router>
    <div className={theme === 'dark' ? 'bg-black text-white min-h-screen' : 'bg-gray-100 text-black min-h-screen'}>
      <Navbar />
     

    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/create" element={<CreateGroup />} />
      <Route path="/join" element={<JoinGroup />} />
      <Route path="/pending" element={<PendingRequests />} />
    </Routes>

    </div>
    </Router>

  
  )
}

export default App
