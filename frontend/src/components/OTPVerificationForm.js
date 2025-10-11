import React, { useState, useEffect } from 'react';
import './Form.css';

const OTPVerificationForm = ({ userData, onPasswordReset, onBackToForgotPassword }) => {
  const [formData, setFormData] = useState({
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Clear form data when component mounts
  useEffect(() => {
    setFormData({
      otp: '',
      newPassword: '',
      confirmPassword: ''
    });
    setErrors({});
    setMessage('');
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.otp) {
      setErrors({ otp: 'OTP is required' });
      return;
    }

    if (!formData.newPassword) {
      setErrors({ newPassword: 'New password is required' });
      return;
    }

    if (formData.newPassword.length < 6) {
      setErrors({ newPassword: 'Password must be at least 6 characters long' });
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: 'Passwords do not match' });
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: userData.email,
          role: userData.role,
          otp: formData.otp,
          newPassword: formData.newPassword,
          resetToken: userData.resetToken
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to reset password' });
        return;
      }

      setMessage('Password has been reset successfully! You can now login with your new password.');

      // Redirect to login after successful reset
      setTimeout(() => {
        onPasswordReset();
      }, 2000);

    } catch (error) {
      console.error('Password Reset Error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="registration-page">
      <div className="illustration">
        <div className="woman-placeholder">🔑</div>
      </div>
      <div className="form-card">
        <h2 className="form-title">RESET PASSWORD</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary-text)' }}>
          We've sent a 6-digit OTP to <strong>{userData?.email}</strong>. Enter it below along with your new password.
        </p>

        {message && (
          <div style={{
            background: message.includes('successfully') ? 'var(--success-bg)' : 'var(--error-bg)',
            color: message.includes('successfully') ? 'var(--success-text)' : 'var(--error-text)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="otp">🔢 OTP Code</label>
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
            <label htmlFor="newPassword">🔒 New Password</label>
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
            <label htmlFor="confirmPassword">🔄 Confirm New Password</label>
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

          {errors.general && <p className="error-message">{errors.general}</p>}

          <button type="submit" className="register-btn" disabled={isLoading}>
            {isLoading ? 'RESETTING...' : 'RESET PASSWORD'}
          </button>
        </form>

        <p className="login-link">
          Didn't receive OTP? <button onClick={onBackToForgotPassword} className="toggle-link-button" type="button">Try Again</button>
        </p>
      </div>
      <div className="plant-placeholder">🌿</div>
    </div>
  );
};

export default OTPVerificationForm;