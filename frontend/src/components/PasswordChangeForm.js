import React, { useState } from 'react';
import './Form.css';

const PasswordChangeForm = ({ user, onPasswordChanged, onLogout }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validation
    if (formData.newPassword !== formData.confirmPassword) {
      setError('New passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');

      // Use the current password they entered
      const currentPasswordToSend = formData.currentPassword;

      const response = await fetch('http://localhost:5001/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          email: user.email,
          teacherId: user.teacherId || user.uniqueId,
          currentPassword: currentPasswordToSend,
          newPassword: formData.newPassword,
          role: user.role,
          userId: user.id || user._id // Add user ID for better user lookup
        })
      });

      const data = await response.json();

      if (response.ok) {
        alert('Password changed successfully!');
        onPasswordChanged();
      } else {
        setError(data.message || 'Failed to change password');
      }
    } catch (error) {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="password-change-container">
      <div className="password-change-form">
        <h2>🔐 Change Password Required</h2>
        <p>Welcome, {user.name}! For security reasons, you must change your password before proceeding.</p>

        <div className="password-info">
          <p><strong>Current Password:</strong> {user.teacherId || user.uniqueId || 'Your current password'}</p>
          <p><em>Your current password is your {user.role === 'superadmin' ? 'SuperAdmin ID' : user.role === 'admin' ? 'Admin ID' : 'unique ID'}. Please change it to a secure password.</em></p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Current Password *</label>
            <input
              type="password"
              name="currentPassword"
              value={formData.currentPassword}
              onChange={handleChange}
              required
              placeholder="Enter your current password"
            />
          </div>

          <div className="form-group">
            <label>New Password *</label>
            <input
              type="password"
              name="newPassword"
              value={formData.newPassword}
              onChange={handleChange}
              required
              placeholder="Enter new password (min 6 characters)"
            />
          </div>

          <div className="form-group">
            <label>Confirm New Password *</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              placeholder="Confirm new password"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="form-actions">
            <button type="submit" disabled={loading} className="submit-button">
              {loading ? 'Changing Password...' : 'Change Password & Continue'}
            </button>
            <button type="button" onClick={onLogout} className="logout-button">
              Logout
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordChangeForm;