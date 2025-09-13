// This is a React component, so it should not have backend code like readDb
import React, { useState } from 'react';
import SignupForm from './SignupForm';
import PasswordForm from './PasswordForm';
import StudentDashboard from './StudentDashboard';
import LoginForm from './LoginForm';
import './AuthContainer.css';

const AuthContainer = ({ onBackToHome }) => {
  const [currentView, setCurrentView] = useState('login');
  const [username, setUsername] = useState('');
  const [signupData, setSignupData] = useState({});

  const handleRegistrationSuccess = (formData) => {
    setSignupData(formData);
    setUsername(formData.email);
    setCurrentView('password');
  };

  const handlePasswordSet = (authData) => {
    setUsername(authData.username);
    console.log('Registration complete for:', authData.username);
    setCurrentView('dashboard');
  };

  const handleLoginSuccess = (user) => {
    setUsername(user.username);
    setCurrentView('dashboard');
  };

  const handleLogout = () => {
    setCurrentView('login');
    setUsername('');
  };

  const renderView = () => {
    switch (currentView) {
      case 'signup':
        return (
          <div>
            <button onClick={onBackToHome} className="back-to-home-btn">Back to Home</button>
            <SignupForm
              onToggleForm={() => setCurrentView('login')}
              onRegistrationSuccess={handleRegistrationSuccess}
            />
          </div>
        );
      case 'login':
        return (
          <div>
            <button onClick={onBackToHome} className="back-to-home-btn">Back to Home</button>
            <LoginForm
              onToggleForm={() => setCurrentView('signup')}
              onLoginSuccess={handleLoginSuccess}
            />
          </div>
        );
      case 'password':
        return (
          <PasswordForm
            username={username}
            signupData={signupData}
            onSetPassword={handlePasswordSet}
          />
        );
      case 'dashboard':
        return (
          <div>
            <button onClick={onBackToHome} className="back-to-home-btn">Back to Home</button>
            <StudentDashboard
              username={username}
              onLogout={handleLogout}
            />
          </div>
        );
      default:
        return <SignupForm onToggleForm={() => setCurrentView('login')} />;
    }
  };

  return (
    <div className="auth-container">
      {renderView()}
    </div>
  );
};

export default AuthContainer;