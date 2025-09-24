// This is a React component, so it should not have backend code like readDb
import React, { useState } from 'react';
import SignupForm from './SignupForm';
import PasswordForm from './PasswordForm';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import LoginForm from './LoginForm';
import './AuthContainer.css';

const AuthContainer = ({ mode = 'login', onBackToHome }) => {
  const [currentView, setCurrentView] = useState(mode);
  const [username, setUsername] = useState('');
  const [userRole, setUserRole] = useState('');
  const [tempPassword, setTempPassword] = useState(false);
  const [signupData, setSignupData] = useState({});

  const handleRegistrationSuccess = (formData) => {
    setSignupData(formData);
    setUsername(formData.email);
    setCurrentView('password');
  };

  const handlePasswordSet = (authData) => {
    setUsername(authData.username);
    setUserRole('student'); // Set role to student for signup users
    console.log('Registration complete for:', authData.username);
    setCurrentView('dashboard');
  };

  const handleLoginSuccess = (user) => {
    setUsername(user.username);
    setUserRole(user.role);
    setTempPassword(user.tempPassword || false);

    // Check if user needs to change password (teachers with temp password)
    if (user.role === 'teacher' && user.tempPassword) {
      setCurrentView('password');
    } else {
      setCurrentView('dashboard');
    }
  };

  const handleLogout = () => {
    setCurrentView('login');
    setUsername('');
    setUserRole('');
    setTempPassword(false);
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
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
            isPasswordChange={userRole === 'teacher' && tempPassword}
          />
        );
      case 'dashboard':
        return (
          <div>
            <button onClick={onBackToHome} className="back-to-home-btn">Back to Home</button>
            {userRole === 'teacher' ? (
              <TeacherDashboard
                username={username}
                onLogout={handleLogout}
                tempPassword={tempPassword}
              />
            ) : (
              <StudentDashboard
                username={username}
                onLogout={handleLogout}
              />
            )}
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
