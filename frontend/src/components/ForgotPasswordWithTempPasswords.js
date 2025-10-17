import React, { useState } from 'react';
import './Form.css';

const ForgotPasswordWithTempPasswords = ({ onBackToLogin, onLoginWithNewPassword }) => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emailVerified, setEmailVerified] = useState(false);
  const [userRole, setUserRole] = useState('');

  const handleEmailVerification = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!email) {
      setError('Please enter your email address');
      setLoading(false);
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      setLoading(false);
      return;
    }

    try {
      // Verify email exists in the system
      const response = await fetch('http://localhost:5001/api/auth/verify-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email
        })
      });

      const data = await response.json();

      if (response.ok && data.exists) {
        setEmailVerified(true);
        setUserRole(data.role || 'student');
        setSuccess('Email verified successfully! Please enter your new password.');
      } else {
        setError(data.message || 'Email not found in our system. Please check your email or contact support.');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    // Validation
    if (!newPassword || !confirmPassword) {
      setError('Please fill in all password fields');
      setLoading(false);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      // Update password for verified email
      const response = await fetch('http://localhost:5001/api/auth/forgot-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email,
          newPassword: newPassword,
          role: userRole
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Password changed successfully! You can now login with your new password.');
        // Auto redirect to login after 2 seconds
        setTimeout(() => {
          onBackToLogin();
        }, 2000);
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setEmailVerified(false);
    setEmail('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setUserRole('');
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <h2>🔑 Forgot Password</h2>
        <p>{emailVerified ? 'Enter your new password' : 'Enter your registered email to reset your password'}</p>
      </div>

      {!emailVerified ? (
        /* Email Verification Section */
        <div className="email-verification-section">
          <form onSubmit={handleEmailVerification}>
            <div className="form-group">
              <label htmlFor="email">📧 Registered Email Address *</label>
              <input
                type="email"
                id="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your registered email address"
                disabled={loading}
              />
            </div>

            <button type="submit" className="submit-btn" disabled={loading}>
              {loading ? 'Verifying Email...' : 'Verify Email'}
            </button>
          </form>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      ) : (
        /* Password Change Section */
        <div className="change-password-section">
          <div className="email-info">
            <p><strong>Verified Email:</strong> {email}</p>
            <p><strong>Account Type:</strong> {userRole}</p>
          </div>

          <form onSubmit={handlePasswordChange}>
            <div className="form-group">
              <label htmlFor="newPassword">🔐 New Password *</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 6 characters)"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">🔐 Confirm New Password *</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? 'Changing Password...' : 'Change Password & Login'}
              </button>
              <button type="button" onClick={resetForm} className="reset-btn" disabled={loading}>
                Use Different Email
              </button>
            </div>
          </form>

          {error && <p className="error-message">{error}</p>}
          {success && <p className="success-message">{success}</p>}
        </div>
      )}

      <p>
        <button onClick={onBackToLogin} className="toggle-link-button" type="button">
          ← Back to Login
        </button>
      </p>
    </div>
  );
};

export default ForgotPasswordWithTempPasswords;