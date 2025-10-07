import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import PasswordForm from './PasswordForm';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import LoginForm from './LoginForm';
import './AuthContainer.css';

const AuthContainer = ({ mode: initialMode }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode || 'signup');
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);

  useEffect(() => {
    setMode(initialMode || 'signup');
  }, [initialMode]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleMode = () => {
    setMode((prevMode) => (prevMode === 'signup' ? 'login' : 'signup'));
  };

  const handleRegistrationSuccess = (signupData) => {
    setSignupData(signupData);
    setMode('setPassword');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);

    // Check if user must change password (temporary password)
    if (userData.mustChangePassword) {
      setUserRole(userData.role);
      setUsername(userData.username);
      setMode('changePasswordAfterLogin');
    } else {
      setUserRole(userData.role);
      setUsername(userData.username);
      setMode('dashboard');
    }
  };

  const [signupData, setSignupData] = React.useState(null);

  const handleLogout = () => {
    setUserRole(null);
    setUsername(null);
    setMode('login');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('teacherId');
  };

  switch (mode) {
    case 'signup':
      return (
        <div className="auth-container">
          <button className="back-to-home-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <SignupForm onToggleForm={toggleMode} onRegistrationSuccess={handleRegistrationSuccess} onBackToHome={handleBackToHome} />
        </div>
      );
    case 'login':
      return (
        <div className="auth-container">
          <button className="back-to-home-btn" onClick={handleBackToHome}>
            ← Back to Home
          </button>
          <LoginForm onToggleForm={toggleMode} onLoginSuccess={handleLoginSuccess} onBackToHome={handleBackToHome} />
        </div>
      );
    case 'setPassword':
      return (
        <div className="auth-container">
          <PasswordForm
            signupData={signupData}
            onSetPassword={() => setMode('dashboard')}
            isPasswordChange={false}
          />
        </div>
      );
    case 'password':
      return (
        <div className="auth-container">
          <PasswordForm />
        </div>
      );
    case 'dashboard':
      if (userRole === 'teacher') {
        return <TeacherDashboard username={username} onLogout={handleLogout} />;
      } else if (userRole === 'admin' || userRole === 'superadmin') {
        return <AdminDashboard username={username} onLogout={handleLogout} />;
      } else {
        return <StudentDashboard username={username} onLogout={handleLogout} />;
      }
    default:
      return (
        <div className="auth-container">
          <SignupForm onToggleForm={toggleMode} onRegistrationSuccess={handleRegistrationSuccess} />
        </div>
      );
  }
};

export default AuthContainer;
