import React,{ useState, useEffect } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'

import { useDispatch } from "react-redux";
import { setPendingRequestsCount } from "./redux/approvalSlice";
import api from "./components/api/api"; 

import AuthPage from './components/AuthForm';
import CreateGroup from './components/Group/CreateGroup';
import JoinGroup from './components/Group/JoinGroup';
import PendingRequests from './components/Group/PendingRequsts';

import { useSelector } from 'react-redux';
import Navbar from './components/Navbar';
import Home from './components/Group/Home';
import GroupPage from './components/Group/GroupPage';
import CreateGoal from './components/Group/CreateGoal';
import Profile from './components/Profile';
import FindMatch from './components/Findmatch';




function App() {
  
  const { theme } = useSelector((state) => state.theme);
  const dispatch = useDispatch();

   const fetchPendingCount = async () => {
    const token = localStorage.getItem("token");
    try {
      const res = await api.get("/api/groups/pending-requests", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      dispatch(setPendingRequestsCount(res.data.length));
    } catch (err) {
      console.error("Failed to fetch pending count", err.message);
    }
  };

  useEffect(() => {
    fetchPendingCount();

    // const interval = setInterval(fetchPendingCount, 5 * 60 * 1000);
    // return () => clearInterval(interval);
  }, []);



  return (

        <Router>
    <div className={theme === 'dark' ? 'bg-black text-white min-h-screen' : 'bg-gray-100 text-black min-h-screen'}>
      <Navbar />
     

    <Routes>
      <Route path="/" element={<AuthPage />} />
      <Route path="/create" element={<CreateGroup />} />
      <Route path="/join" element={<JoinGroup />} />
      <Route path="/pending" element={<PendingRequests />} />
      <Route path="/home" element={<Home />} />
      <Route path="/group/:groupId" element={<GroupPage />}  />
       <Route path="/:groupId/create-goal" element={<CreateGoal />}  />
       <Route path="/profile" element={<Profile />} />
        <Route path="/find-match" element={<FindMatch />} />
    </Routes>

    </div>
    </Router>

  
  )
}

export default App
