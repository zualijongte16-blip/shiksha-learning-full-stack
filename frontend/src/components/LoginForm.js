import React, { useState } from 'react';
import './Form.css';

const LoginForm = ({ onToggleForm, onLoginSuccess, onBackToHome, showNavigation = true }) => {
  const [formData, setFormData] = useState({
    role: 'student',
    name: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const loginData = {
        role: formData.role,
        uniqueId: formData.name,
        password: formData.password
      };

      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Login failed' });
        return;
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('userEmail', formData.name);

        onLoginSuccess({
          username: data.username,
          role: data.role,
          tempPassword: data.tempPassword,
          mustChangePassword: data.tempPassword,
          subject: data.subject,
          teacherId: data.teacherId,
          email: formData.name
        });
      } else {
        throw new Error('Login successful, but no token received.');
      }

    } catch (error) {
      console.error('Login Error:', error);
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="registration-page">
      <div className="illustration">
        <div className="woman-placeholder">👩‍🎓</div>
      </div>
      <div className="form-card">
        <h2 className="form-title">LOG IN</h2>
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
            <label htmlFor="name">👤 {formData.role === 'student' ? 'Email' : 'User ID'}</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <button type="submit" className="register-btn">LOG IN</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <p className="login-link">
          Don't have an account? <button onClick={onToggleForm} className="toggle-link-button" type="button">Sign Up</button>
        </p>
        <p className="login-link">
          <button onClick={() => window.dispatchEvent(new CustomEvent('showForgotPassword'))} className="toggle-link-button" type="button">
            Forgot Password?
          </button>
        </p>
      </div>
      <div className="plant-placeholder">🌿</div>
    </div>
  );
};

export default LoginForm;
