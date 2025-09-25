import React, { useState } from 'react';

const PasswordForm = ({ username, signupData, onSetPassword, isPasswordChange = false }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('New passwords do not match!');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('New password must be at least 6 characters long!');
      return;
    }

    try {
      let response;
      let data;

      if (isPasswordChange) {
        // Password change request
        const userEmail = localStorage.getItem('userEmail');
        const token = localStorage.getItem('token');

        if (!token) {
          setMessage('User session expired. Please log in again.');
          return;
        }

        // For teachers, send teacherId instead of email
        const requestData = {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword
        };

        // Add teacherId for teachers, email for students
        if (userEmail && userEmail.includes('teacher.')) {
          const teacherId = userEmail.split('teacher.')[1].split('@')[0];
          requestData.teacherId = teacherId;
        } else {
          requestData.email = userEmail;
        }

        response = await fetch('http://localhost:5001/api/auth/change-password', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestData),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Password change failed');
        }

        setMessage('Password changed successfully!');
        setTimeout(() => {
          window.location.reload(); // Refresh to update session
        }, 1500);

      } else {
        // Initial registration
        const registrationData = {
          ...signupData,
          password: formData.newPassword,
        };

        response = await fetch('http://localhost:5001/api/auth/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(registrationData),
        });

        data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Registration failed');
        }

        // Registration successful
        onSetPassword({ username, password: formData.newPassword });
      }

    } catch (error) {
      console.error('Error:', error);
      setMessage(error.message);
    }
  };

  return (
    <div className="form-container">
      <h2>{isPasswordChange ? 'Change Password' : 'Set Your Password'}</h2>
      {isPasswordChange && (
        <p className="password-info">
          Please change your temporary password to continue.
        </p>
      )}
      <form onSubmit={handleSubmit}>
        {isPasswordChange && (
          <div className="form-group">
            <label htmlFor="currentPassword">
              Current Password {isPasswordChange && '(Teacher ID)'}
            </label>
            <input
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              placeholder={isPasswordChange ? "Enter your Teacher ID" : "Enter current password"}
              required
            />
          </div>
        )}

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Confirm new password"
            required
          />
        </div>

        <button type="submit" className="submit-btn">
          {isPasswordChange ? 'Change Password' : 'Set Password'}
        </button>

        {isPasswordChange && (
          <button
            type="button"
            className="skip-btn"
            onClick={() => window.location.reload()}
          >
            Skip for Now
          </button>
        )}
      </form>

      {message && (
        <div className={`message ${message.includes('success') ? 'success' : 'error'}`}>
          {message}
        </div>
      )}
    </div>
  );
};

export default PasswordForm;
