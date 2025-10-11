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
import CeoFounderTeam from './components/CeoFounderTeam';
import TeachersTeam from './components/TeachersTeam';
import DevelopersTeam from './components/DevelopersTeam';
import Teams from './components/Teams';
import VisionPage from './components/VisionPage';
import MissionPage from './components/MissionPage';
import ValuesPage from './components/ValuesPage';
import WhyChooseShikshaPage from './components/WhyChooseShikshaPage';
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
        <Route path="/teams" element={<><Teams /><Footer /></>} />

        {/* Auth routes */}
        <Route path="/login" element={<AuthContainer mode="login" />} />
        <Route path="/signup" element={<AuthContainer mode="signup" />} />

        {/* Dashboard & password change */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/change-password" element={<PasswordForm isPasswordChange={true} />} />

        {/* Courses & class detail pages using the same auth handlers */}
        <Route path="/courses" element={<Courses />} />
        <Route path="/class/:id" element={<ClassDetail />} />

        {/* Team pages */}
        <Route path="/team/ceo-founder" element={<CeoFounderTeam />} />
        <Route path="/team/teachers" element={<TeachersTeam />} />
        <Route path="/team/developers" element={<DevelopersTeam />} />

        {/* Vision page */}
        <Route path="/vision" element={<VisionPage />} />

        {/* Mission page */}
        <Route path="/mission" element={<MissionPage />} />

        {/* Values page */}
        <Route path="/values" element={<ValuesPage />} />

        {/* Why Choose Shiksha page */}
        <Route path="/why-choose-shiksha" element={<WhyChooseShikshaPage />} />
      </Routes>
    </div>
  );
}

export default App;
