import React, { useState, useEffect } from 'react';
import './Form.css';

const LoginForm = ({ onToggleForm, onLoginSuccess, onBackToHome, showNavigation = true, onForgotPassword, resetTrigger }) => {
  const [formData, setFormData] = useState({
    role: 'student',
    name: '',
    password: ''
  });

  const [errors, setErrors] = useState({});

  // Clear form data when component mounts (fresh login)
  useEffect(() => {
    console.log('🔄 LoginForm: Component mounted - clearing all form data');
    setFormData({
      role: 'student',
      name: '',
      password: ''
    });
    setErrors({});
  }, []);

  // Force clear form data on any prop change (including form switches)
  useEffect(() => {
    console.log('🔄 LoginForm: Props changed - clearing all form data');
    setFormData({
      role: 'student',
      name: '',
      password: ''
    });
    setErrors({});
  }, [onToggleForm, onLoginSuccess, onBackToHome]);

  // Additional cleanup when form becomes visible/active
  useEffect(() => {
    console.log('🔄 LoginForm: Form activated - ensuring clean state');
    setFormData({
      role: 'student',
      name: '',
      password: ''
    });
    setErrors({});
  }, []);

  // Force reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log('🔄 LoginForm: Reset trigger activated - FORCE CLEARING ALL DATA');
      setFormData({
        role: 'student',
        name: '',
        password: ''
      });
      setErrors({});
    }
  }, [resetTrigger]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // CRITICAL: If user types in a field that has old data, clear ALL form data
    const oldValue = formData[name];
    if (value.length > 0 && oldValue && value !== oldValue) {
      console.log('🔥 USER TYPING IN FIELD WITH OLD DATA - CLEARING ALL LOGIN FORM DATA');
      setFormData({
        role: 'student',
        name: '',
        password: ''
      });
      setErrors({});
    }

    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Client-side validation
    if (!formData.name.trim()) {
      setErrors({ general: formData.role === 'student' ? 'Email is required' : 'User ID is required' });
      return;
    }

    if (!formData.password.trim()) {
      setErrors({ general: 'Password is required' });
      return;
    }

    setErrors({});

    try {
      const loginData = {
        role: formData.role,
        email: formData.role === 'student' ? formData.name : undefined,
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

        // Clear form data after successful login
        setFormData({
          role: 'student',
          name: '',
          password: ''
        });
        setErrors({});

        onLoginSuccess({
          username: data.username,
          role: data.role,
          tempPassword: data.tempPassword,
          mustChangePassword: data.mustChangePassword,
          subject: data.subject,
          teacherId: data.teacherId,
          email: formData.name,
          id: data.id
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
        <p className="forgot-password-link">
          <button onClick={onForgotPassword} className="toggle-link-button" type="button">Forgot Password?</button>
        </p>
      </div>
      <div className="plant-placeholder">🌿</div>
    </div>
  );
};

export default LoginForm;
