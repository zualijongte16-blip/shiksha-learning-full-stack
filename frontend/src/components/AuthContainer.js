import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import SignupForm from './SignupForm';
import PasswordForm from './PasswordForm';
import StudentDashboard from './StudentDashboard';
import TeacherDashboard from './TeacherDashboard';
import AdminDashboard from './AdminDashboard';
import SuperAdminDashboard from './SuperAdminDashboard';
import LoginForm from './LoginForm';
import PasswordChangeForm from './PasswordChangeForm';
import ForgotPasswordForm from './ForgotPasswordForm';
import OTPVerificationForm from './OTPVerificationForm';
import './AuthContainer.css';

// Navigation Bar Component
const NavigationBar = ({ currentStep, totalSteps, onBack, onForward, canGoBack = true, canGoForward = false }) => {
  const handleBrowserBack = () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      onBack();
    }
  };

  const handleBrowserForward = () => {
    if (window.history.length > window.history.state?.idx + 1) {
      window.history.forward();
    } else {
      onForward();
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '10px',
      left: '10px',
      right: '10px',
      backgroundColor: '#f8f9fa',
      border: '1px solid #dee2e6',
      borderRadius: '8px',
      padding: '10px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      zIndex: 1000,
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={handleBrowserBack}
          disabled={!canGoBack}
          style={{
            backgroundColor: canGoBack ? '#007bff' : '#6c757d',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: canGoBack ? 'pointer' : 'not-allowed',
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '14px'
          }}
        >
          ← Back
        </button>

        <span style={{ fontSize: '14px', color: '#666' }}>
          Step {currentStep} of {totalSteps}
        </span>
      </div>

      <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#333' }}>
        Shiksha Authentication
      </div>

      <button
        onClick={handleBrowserForward}
        disabled={!canGoForward}
        style={{
          backgroundColor: canGoForward ? '#28a745' : '#6c757d',
          color: 'white',
          border: 'none',
          padding: '8px 16px',
          borderRadius: '4px',
          cursor: canGoForward ? 'pointer' : 'not-allowed',
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          fontSize: '14px'
        }}
      >
        Next →
      </button>
    </div>
  );
};


const AuthContainer = ({ mode: initialMode }) => {
  const navigate = useNavigate();
  const [mode, setMode] = useState(initialMode || 'signup');
  const [userRole, setUserRole] = useState(null);
  const [username, setUsername] = useState(null);
  const [tempUserData, setTempUserData] = useState(null);
  const [forgotPasswordData, setForgotPasswordData] = useState(null);
  const [formKey, setFormKey] = useState(Date.now()); // Key to force component remount
  const [resetTrigger, setResetTrigger] = useState(0); // Additional trigger for form reset


  useEffect(() => {
    setMode(initialMode || 'signup');
  }, [initialMode]);

  const handleBackToHome = () => {
    navigate('/');
  };

  const toggleMode = () => {
    console.log('🔄 AuthContainer: FORCE RESETTING ALL FORMS');

    // Force component remount by changing key
    setFormKey(Date.now());

    // Trigger additional reset for all forms
    setResetTrigger(prev => prev + 1);

    // Clear any existing form data when switching modes
    setMode((prevMode) => {
      const newMode = prevMode === 'signup' ? 'login' : 'signup';
      console.log(`🔄 Switching from ${prevMode} to ${newMode} with complete reset`);
      return newMode;
    });
  };

  const handleRegistrationSuccess = (signupData) => {
    setSignupData(signupData);
    setMode('setPassword');
  };

  const handleLoginSuccess = (userData) => {
    console.log('Login successful:', userData);

    // Check if user must change password (temporary password)
    if (userData.mustChangePassword) {
      setTempUserData(userData);
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
    setTempUserData(null);

    // Force remount and reset forms on logout
    setFormKey(Date.now());
    setResetTrigger(prev => prev + 1);

    setMode('login');
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('teacherId');
  };

  const handlePasswordChanged = () => {
    // Password change successful, proceed to dashboard
    setUserRole(tempUserData.role);
    setUsername(tempUserData.username);
    setTempUserData(null);
    setMode('dashboard');
  };

  const handleForgotPassword = () => {
    setMode('forgotPassword');
  };

  const handlePasswordReset = () => {
    setMode('login');
  };


  switch (mode) {
    case 'signup':
      return (
        <div className="auth-container">
          <NavigationBar
            currentStep={1}
            totalSteps={2}
            onBack={handleBackToHome}
            onForward={() => setMode('setPassword')}
            canGoBack={true}
            canGoForward={false}
          />
          <div style={{ marginTop: '80px' }}>
            <SignupForm key={`signup-form-${formKey}`} onToggleForm={toggleMode} onRegistrationSuccess={handleRegistrationSuccess} onBackToHome={handleBackToHome} showNavigation={false} resetTrigger={resetTrigger} />
          </div>

        </div>
      );
    case 'login':
      return (
        <div className="auth-container">
          <NavigationBar
            currentStep={1}
            totalSteps={1}
            onBack={handleBackToHome}
            onForward={() => {}}
            canGoBack={true}
            canGoForward={false}
          />
          <div style={{ marginTop: '80px' }}>
            <LoginForm key={`login-form-${formKey}`} onToggleForm={toggleMode} onLoginSuccess={handleLoginSuccess} onBackToHome={handleBackToHome} onForgotPassword={handleForgotPassword} showNavigation={false} resetTrigger={resetTrigger} />
          </div>

        </div>
      );
    case 'setPassword':
      return (
        <div className="auth-container">
          <NavigationBar
            currentStep={2}
            totalSteps={2}
            onBack={() => setMode('login')}
            onForward={() => {
              // After password is set, go to dashboard
              setUserRole('student');
              setUsername(signupData?.firstName || 'Student');
              setMode('dashboard');
            }}
            canGoBack={true}
            canGoForward={true}
          />
          <div style={{ marginTop: '80px' }}>
            <PasswordForm
              signupData={signupData}
              onSetPassword={() => {
                // Set user as logged in and go to dashboard
                setUserRole('student');
                setUsername(signupData?.firstName || 'Student');
                setMode('dashboard');
              }}
              onBackToSignup={() => setMode('login')}
              isPasswordChange={false}
            />
          </div>

        </div>
      );
    case 'password':
      return (
        <div className="auth-container">
          <PasswordForm />
        </div>
      );

    case 'changePasswordAfterLogin':
      return (
        <div className="auth-container">
          <PasswordChangeForm
            user={{
              name: tempUserData?.username,
              email: tempUserData?.email,
              teacherId: tempUserData?.teacherId,
              role: tempUserData?.role
            }}
            onPasswordChanged={handlePasswordChanged}
            onLogout={handleLogout}
          />
        </div>
      );

    case 'forgotPassword':
      return (
        <div className="auth-container">
          <NavigationBar
            currentStep={1}
            totalSteps={1}
            onBack={() => setMode('login')}
            onForward={() => {}}
            canGoBack={true}
            canGoForward={false}
          />
          <div style={{ marginTop: '80px' }}>
            <ForgotPasswordForm
              onBackToLogin={() => setMode('login')}
              onPasswordReset={handlePasswordReset}
              onBackToHome={handleBackToHome}
              showNavigation={false}
            />
          </div>
        </div>
      );
    case 'dashboard':
      if (userRole === 'teacher') {
        return <TeacherDashboard username={username} onLogout={handleLogout} />;
      } else if (userRole === 'superadmin') {
        return <SuperAdminDashboard username={username} onLogout={handleLogout} />;
      } else if (userRole === 'admin') {

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
