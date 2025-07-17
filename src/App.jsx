import React,{ useState } from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';

import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
// import './App.css']

import AuthPage from './components/AuthForm';
import CreateGroup from './components/Group/CreateGroup';
import JoinGroup from './components/Group/JoinGroup';
import PendingRequests from './components/Group/PendingRequsts';



function App() {
  const [count, setCount] = useState(0)

  return (
    <Router>

    <Routes>
      <Route path="/auth" element={<AuthPage />} />
      <Route path="/create" element={<CreateGroup />} />
      <Route path="/join" element={<JoinGroup />} />
      <Route path="/pending" element={<PendingRequests />} />
    </Routes>

    </Router>
  )
}

export default App
