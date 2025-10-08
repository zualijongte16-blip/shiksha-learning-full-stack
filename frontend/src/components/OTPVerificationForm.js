import React, { useState } from 'react';
import './Form.css';

const OTPVerificationForm = ({ userData, onPasswordReset, onBackToForgotPassword }) => {
  const [formData, setFormData] = useState({
    otp: '123456789', // Pre-fill with fixed OTP for testing
    newPassword: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors({ ...errors, [name]: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    setErrors({});

    // Validate OTP
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors({ otp: 'Please enter a valid 6-digit OTP' });
      setLoading(false);
      return;
    }

    // Validate password
    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters long' });
      setLoading(false);
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        identifier: userData.identifier, // Can be either email or phone
        otp: formData.otp,
        newPassword: formData.newPassword
      };

      const response = await fetch('http://localhost:5001/api/auth/verify-otp-reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'OTP verification failed' });
        setLoading(false);
        return;
      }

      // Password reset successful
      setMessage(data.message);
      setTimeout(() => {
        onPasswordReset();
      }, 2000);

    } catch (error) {
      console.error('OTP verification error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <h2>Verify OTP & Reset Password</h2>
        <p>
          Enter the OTP for password reset. (Testing OTP: 123456789)
        </p>
        <p className="identifier-info">
          <strong>Identifier:</strong> {userData.identifier}
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="otp">Enter OTP</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            placeholder="Enter 6-digit OTP"
            maxLength="6"
            pattern="[0-9]{6}"
            required
          />
          {errors.otp && <span className="error-message">{errors.otp}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Enter new password (min 6 characters)"
            required
          />
          {errors.newPassword && <span className="error-message">{errors.newPassword}</span>}
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
          {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Verifying...' : 'Reset Password'}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {errors.general && <p className="error-message">{errors.general}</p>}

      <p>
        Didn't receive OTP?{' '}
        <button onClick={onBackToForgotPassword} className="toggle-link-button" type="button">
          Request Again
        </button>
      </p>
    </div>
  );
};

export default OTPVerificationForm;