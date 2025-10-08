import React, { useState } from 'react';
import './Form.css';

const LoginForm = ({ onToggleForm, onLoginSuccess, onBackToHome, showNavigation = true }) => {

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    uniqueId: '',
    role: 'student' // Default to student
  });

  const [loginMode, setLoginMode] = useState('student'); // 'student', 'teacher', 'admin' or 'superadmin'

  const [resetMessage, setResetMessage] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpData, setOtpData] = useState({
    otp: '',
    newPassword: '',
    confirmNewPassword: ''
  });
  const [otpError, setOtpError] = useState('');
  
  const handleOtpChange = (e) => {
    setOtpData({ ...otpData, [e.target.name]: e.target.value });
  };

  const handleVerifyOtp = async () => {
    if (otpData.newPassword !== otpData.confirmNewPassword) {
      setOtpError('New password and confirm password do not match');
      return;
    }
    setOtpError('');
    try {
      let verifyData;
      if (loginMode === 'teacher') {
        verifyData = {
          uniqueId: formData.uniqueId,
          role: 'teacher',
          otp: otpData.otp,
          newPassword: otpData.newPassword
        };
      } else if (loginMode === 'admin') {
        verifyData = {
          uniqueId: formData.uniqueId,
          role: 'admin',
          otp: otpData.otp,
          newPassword: otpData.newPassword
        };
      } else if (loginMode === 'superadmin') {
        verifyData = {
          uniqueId: formData.uniqueId,
          role: 'superadmin',
          otp: otpData.otp,
          newPassword: otpData.newPassword
        };
      } else {
        verifyData = {
          email: formData.email,
          role: 'student',
          otp: otpData.otp,
          newPassword: otpData.newPassword
        };
      }

      const response = await fetch('http://localhost:5001/api/auth/verify-otp-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(verifyData),
      });

      const data = await response.json();

      if (!response.ok) {
        setOtpError(data.message || 'OTP verification failed');
        return;
      }

      setResetMessage('Password reset successfully. You can now log in with your new password.');
      setOtpSent(false);
      setOtpData({ otp: '', newPassword: '', confirmNewPassword: '' });
    } catch (error) {
      console.error('OTP Verification Error:', error);
      setOtpError('An error occurred during OTP verification.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setLoginMode(e.target.value);
    setFormData({ ...formData, role: e.target.value });
  };

  const handleForgotPassword = async () => {
    // Validate required fields before sending request
    if (loginMode === 'teacher' && !formData.uniqueId) {
      setResetMessage('Please enter your Teacher ID to reset password.');
      return;
    }
    if (loginMode === 'admin' && !formData.uniqueId) {
      setResetMessage('Please enter your Admin ID to reset password.');
      return;
    }
    if (loginMode === 'superadmin' && !formData.uniqueId) {
      setResetMessage('Please enter your SuperAdmin ID to reset password.');
      return;
    }
    if (loginMode === 'student' && !formData.email) {
      setResetMessage('Please enter your email to reset password.');
      return;
    }

    try {
      let resetData;

      if (loginMode === 'teacher') {
        resetData = {
          uniqueId: formData.uniqueId,
          role: 'teacher'
        };
      } else if (loginMode === 'admin') {
        resetData = {
          uniqueId: formData.uniqueId,
          role: 'admin'
        };
      } else if (loginMode === 'superadmin') {
        resetData = {
          uniqueId: formData.uniqueId,
          role: 'superadmin'
        };
      } else {
        resetData = {
          email: formData.email,
          role: 'student'
        };
      }

      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(resetData),
      });

      const data = await response.json();

      if (!response.ok) {
        setResetMessage(data.message || 'Reset failed');
        return;
      }

      setResetMessage(data.message);
      setOtpSent(true);
    } catch (error) {
      console.error('Reset Error:', error);
      setResetMessage('An error occurred while resetting password.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let loginData;

      if (loginMode === 'teacher') {
        loginData = {
          uniqueId: formData.uniqueId,
          password: formData.password,
          role: 'teacher'
        };
      } else if (loginMode === 'admin') {
        loginData = {
          uniqueId: formData.uniqueId,
          password: formData.password,
          role: 'admin'
        };
      } else if (loginMode === 'superadmin') {
        loginData = {
          uniqueId: formData.uniqueId,
          password: formData.password,
          role: 'superadmin'
        };
      } else {
        loginData = {
          email: formData.email,
          password: formData.password,
          role: 'student'
        };
      }

      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      if (data.token) {
        localStorage.setItem('token', data.token);

        if (loginMode === 'teacher') {
          localStorage.setItem('userEmail', `teacher.${formData.uniqueId}@shiksha.edu`);
          localStorage.setItem('teacherId', formData.uniqueId); // Store teacher ID for API calls

        } else if (loginMode === 'admin') {
          localStorage.setItem('userEmail', `admin.${formData.uniqueId}@shiksha.edu`);
        } else if (loginMode === 'superadmin') {
          localStorage.setItem('userEmail', `superadmin.${formData.uniqueId}@shiksha.edu`);
        } else {
          localStorage.setItem('userEmail', formData.email);
        }

        onLoginSuccess({
          username: data.username,
          role: data.role,
          tempPassword: data.tempPassword,
          mustChangePassword: data.tempPassword, // Force password change for temp passwords
          subject: data.subject,
          teacherId: formData.uniqueId,
          email: loginMode === 'student' ? formData.email : `${loginMode}.${formData.uniqueId}@shiksha.edu`

        });
      } else {
         throw new Error('Login successful, but no token received.');
      }

    } catch (error) {
      console.error('Login Error:', error);
      alert(error.message);
    }
  };

  return (
    <div className="form-container">
      <div className="form-header">
        <h2>Log In</h2>
      </div>

      {/* User Type Radio Buttons */}
      <div className="user-type-selection">
        <label>
          <input
            type="radio"
            name="role"
            value="student"
            checked={loginMode === 'student'}
            onChange={handleRoleChange}
          />
          Student
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="teacher"
            checked={loginMode === 'teacher'}
            onChange={handleRoleChange}
          />
          Teacher
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="admin"
            checked={loginMode === 'admin'}
            onChange={handleRoleChange}
          />
          Admin
        </label>
        <label>
          <input
            type="radio"
            name="role"
            value="superadmin"
            checked={loginMode === 'superadmin'}
            onChange={handleRoleChange}
          />
          Superadmin
        </label>
      </div>

      <form onSubmit={handleSubmit}>
        {loginMode === 'teacher' ? (
          <>
            <div className="form-group">
              <label htmlFor="uniqueId">Teacher ID</label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Enter your Teacher ID"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="teacher-info">
              <p><strong>Subject:</strong> Will be displayed after login</p>
            </div>
          </>
        ) : loginMode === 'admin' ? (
          <>
            <div className="form-group">
              <label htmlFor="uniqueId">Admin ID</label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Enter your Admin ID (e.g., AD001)"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="admin-info">
              <p><strong>Role:</strong> Progress Monitoring (Read-only access)</p>
            </div>
          </>
        ) : loginMode === 'superadmin' ? (
          <>
            <div className="form-group">
              <label htmlFor="uniqueId">SuperAdmin ID</label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Enter your SuperAdmin ID (e.g., SA001)"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="superadmin-info">
              <p><strong>Role:</strong> Full System Administration</p>
            </div>
          </>
        ) : (
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" className="submit-btn">Log In</button>
      </form>
      <p>

        <button onClick={() => window.location.href = '/forgot-password'} className="toggle-link-button" type="button">Forgot Password?</button>

      </p>
      {resetMessage && <p>{resetMessage}</p>}

      {otpSent && (
        <div className="otp-verification">
          <h3>Verify OTP and Reset Password</h3>
          <div className="form-group">
            <label htmlFor="otp">OTP</label>
            <input
              type="text"
              id="otp"
              name="otp"
              value={otpData.otp}
              onChange={handleOtpChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <input
              type="password"
              id="newPassword"
              name="newPassword"
              value={otpData.newPassword}
              onChange={handleOtpChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="confirmNewPassword">Confirm New Password</label>
            <input
              type="password"
              id="confirmNewPassword"
              name="confirmNewPassword"
              value={otpData.confirmNewPassword}
              onChange={handleOtpChange}
              required
            />
          </div>
          {otpError && <p className="error-message">{otpError}</p>}
          <button onClick={handleVerifyOtp} className="submit-btn" type="button">Reset Password</button>
        </div>
      )}

      <p>
        Don't have an account? <button onClick={onToggleForm} className="toggle-link-button" type="button">Sign Up</button>
      </p>
    </div>
  );
};

export default LoginForm;
