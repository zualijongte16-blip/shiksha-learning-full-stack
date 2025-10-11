import React, { useState, useEffect } from 'react';
import './Form.css';

const ForgotPasswordForm = ({ onBackToLogin, onPasswordReset }) => {
  const [formData, setFormData] = useState({
    email: '',
    role: 'student'
  });

  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showTempPassword, setShowTempPassword] = useState(false);

  // Clear form data when component mounts
  useEffect(() => {
    console.log('🔄 ForgotPasswordForm: Component mounted - clearing all form data');
    setFormData({
      email: '',
      role: 'student'
    });
    setErrors({});
    setMessage('');
    setShowTempPassword(false);
  }, []);

  // Additional cleanup when form becomes visible/active
  useEffect(() => {
    console.log('🔄 ForgotPasswordForm: Form activated - ensuring clean state');
    setFormData({
      email: '',
      role: 'student'
    });
    setErrors({});
    setMessage('');
    setShowTempPassword(false);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // CRITICAL: If user types in a field that has old data, clear ALL form data
    const oldValue = formData[name];
    if (value.length > 0 && oldValue && value !== oldValue) {
      console.log('🔥 USER TYPING IN FIELD WITH OLD DATA - CLEARING ALL FORGOT PASSWORD FORM DATA');
      setFormData({
        email: '',
        role: 'student'
      });
      setErrors({});
      setMessage('');
      setShowTempPassword(false);
    }

    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
    setMessage('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email) {
      setErrors({ email: 'Email is required' });
      return;
    }

    setIsLoading(true);
    setMessage('');

    try {
      const response = await fetch('http://localhost:5001/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          role: formData.role
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'User not found' });
        return;
      }

      // Show the temporary password
      setShowTempPassword(true);
      setMessage(`Your temporary password is: 123456. Use this to login and then you can change it.`);

    } catch (error) {
      console.error('Forgot Password Error:', error);
      setErrors({ general: 'Network error. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUseTempPassword = () => {
    // Redirect back to login
    onPasswordReset();
  };

  return (
    <div className="registration-page">
      <div className="illustration">
        <div className="woman-placeholder">🔐</div>
      </div>
      <div className="form-card">
        <h2 className="form-title">FORGOT PASSWORD</h2>
        <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: 'var(--secondary-text)' }}>
          Enter your email address to get your temporary password.
        </p>

        {message && (
          <div style={{
            background: showTempPassword ? 'var(--success-bg)' : 'var(--error-bg)',
            color: showTempPassword ? 'var(--success-text)' : 'var(--error-text)',
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1rem',
            textAlign: 'center'
          }}>
            {message}
          </div>
        )}

        {!showTempPassword ? (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="role">🎓 Role</label>
              <select id="role" name="role" value={formData.role} onChange={handleChange} required>
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="admin">Admin</option>
                <option value="superadmin">Super Admin</option>
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="email">📧 Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>

            {errors.general && <p className="error-message">{errors.general}</p>}

            <button type="submit" className="register-btn" disabled={isLoading}>
              {isLoading ? 'CHECKING...' : 'GET TEMPORARY PASSWORD'}
            </button>
          </form>
        ) : (
          <div style={{ textAlign: 'center' }}>
            <div style={{
              background: 'var(--primary-bg)',
              padding: '2rem',
              borderRadius: '10px',
              marginBottom: '1rem'
            }}>
              <h3 style={{ color: 'var(--primary-text)', marginBottom: '1rem' }}>
                🔑 Your Temporary Password
              </h3>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: 'var(--accent-blue)',
                background: 'var(--light-blue-bg)',
                padding: '1rem',
                borderRadius: '5px',
                margin: '1rem 0',
                letterSpacing: '2px'
              }}>
                123456
              </div>
              <p style={{ color: 'var(--secondary-text)' }}>
                Use this password to login to your account
              </p>
            </div>
            <button onClick={handleUseTempPassword} className="register-btn">
              GO TO LOGIN
            </button>
          </div>
        )}

        <p className="login-link">
          Remember your password? <button onClick={onBackToLogin} className="toggle-link-button" type="button">Back to Login</button>
        </p>
      </div>
      <div className="plant-placeholder">🌿</div>
    </div>
  );
};

export default ForgotPasswordForm;