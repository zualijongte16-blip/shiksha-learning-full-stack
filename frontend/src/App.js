import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import Service from './components/Service';
import ContactPage from './components/ContactPage';
import About from './components/about';
import Footer from './components/Footer';
import Service2 from './components/Service2';
import About2 from './components/About2';
import Contact2 from './components/Contact2';
import Courses from './components/Courses';
import ClassDetail from './components/ClassDetail';
import './index.css';
import './App.css';

import AuthContainer from './components/AuthContainer';
import PasswordForm from './components/PasswordForm';
import Dashboard from './components/Dashboard';

function App() {
  const navigate = useNavigate();

  // Auth handlers

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
        {/* Scrollable landing page */}
        <Route 
          path="/" 
          element={
            <>
              <Home />
              <Service />
              <About />
              <ContactPage />
              <Footer />
            </>
          } 
        />

        {/* Standalone pages */}
        <Route path="/service" element={<><Service2 /><Footer /></>} />
        <Route path="/about" element={<><About2 /><Footer /></>} />
        <Route path="/contact" element={<><Contact2 /><Footer /></>} />

        {/* Auth routes */}
        <Route path="/login" element={<AuthContainer mode="login" />} />
        <Route path="/signup" element={<AuthContainer mode="signup" />} />

        {/* Dashboard & password change */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<PasswordForm isPasswordChange={true} />} />

        {/* Courses & class detail pages using the same auth handlers */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/class/:id" element={<ClassDetail />} />
      </Routes>
    </div>
  );
}

export default App;
