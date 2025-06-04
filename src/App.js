// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Profile from './components/Profile';
import UserSearch from './components/UserSearch';
import Navbar from './components/Navbar';

// Component to conditionally render Navbar based on route
function AppContent() {
  const location = useLocation();
  const showNavbar = !['/', '/register'].includes(location.pathname);

  return (
    <>
      {showNavbar && <Navbar />} {/* Show Navbar for all routes except / and /register */}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/search" element={<UserSearch />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;