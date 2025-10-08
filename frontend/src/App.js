import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Service from './components/Service';
import ContactPage from './components/ContactPage';
import About from './components/about';
import Footer from './components/Footer';
import './index.css';
import './App.css';

import AuthContainer from './components/AuthContainer';
import PasswordForm from './components/PasswordForm';
import Dashboard from './components/Dashboard';

function App() {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/login');
  };

  const handleSignupClick = () => {
    navigate('/signup');
  };

  return (
    <div className="App">
      <Navbar onLoginClick={handleLoginClick} onSignupClick={handleSignupClick} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/service" element={<Service />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/login" element={<AuthContainer mode="login" />} />
        <Route path="/signup" element={<AuthContainer mode="signup" />} />
        <Route path="/forgot-password" element={<AuthContainer mode="forgotPassword" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<PasswordForm isPasswordChange={true} />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
