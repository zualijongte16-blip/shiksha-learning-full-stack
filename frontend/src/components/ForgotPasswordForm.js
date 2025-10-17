import React, { useState } from 'react';
import './Form.css';

const ForgotPasswordForm = ({ onBackToLogin, onOTPSent, onBackToHome, showNavigation = true }) => {
  const [formData, setFormData] = useState({
    email: '',
    phone: '',
    identifier: '' // Can be either email or phone
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

    // Validate that identifier is provided
    if (!formData.identifier) {
      setErrors({ identifier: 'Please enter your email or phone number' });
      setLoading(false);
      return;
    }

    try {
      const requestData = {
        identifier: formData.identifier // Can be either email or phone
      };

      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Failed to send OTP' });
        setLoading(false);
        return;
      }

      // OTP sent successfully
      setMessage(data.message);
      onOTPSent(formData);

    } catch (error) {
      console.error('Forgot password error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    }

    setLoading(false);
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <h2>Forgot Password</h2>
        <p>Enter your email or phone number to receive an OTP for password reset</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="identifier">Email or Phone Number</label>
          <input
            type="text"
            id="identifier"
            name="identifier"
            value={formData.identifier}
            onChange={handleChange}
            placeholder="Enter your registered email or phone number"
            required
          />
          {errors.identifier && <span className="error-message">{errors.identifier}</span>}
        </div>

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Sending OTP...' : 'Send OTP'}
        </button>
      </form>

      {message && <p className="success-message">{message}</p>}
      {errors.general && <p className="error-message">{errors.general}</p>}

      <p>
        Remember your password?{' '}
        <button onClick={onBackToLogin} className="toggle-link-button" type="button">
          Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordForm;