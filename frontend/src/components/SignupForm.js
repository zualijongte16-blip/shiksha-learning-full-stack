import React, { useState, useEffect } from 'react';
import './Form.css';

const SignupForm = ({ onToggleForm, resetTrigger }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  // Clear form data when component mounts (fresh signup)
  useEffect(() => {
    console.log('🔄 SignupForm: Component mounted - clearing all form data');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  }, []);

  // Force clear form data on any prop change (including form switches)
  useEffect(() => {
    console.log('🔄 SignupForm: Props changed - clearing all form data');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  }, [onToggleForm]);

  // Additional cleanup when form becomes visible/active
  useEffect(() => {
    console.log('🔄 SignupForm: Form activated - ensuring clean state');
    setFormData({
      name: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: ''
    });
    setErrors({});
  }, []);

  // Force reset when resetTrigger changes
  useEffect(() => {
    if (resetTrigger > 0) {
      console.log('🔄 SignupForm: Reset trigger activated - FORCE CLEARING ALL DATA');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    }
  }, [resetTrigger]);

  const validatePhone = (phone) => {
    // Only allow exactly 10 digits (no +91 prefix)
    const regex10Digits = /^[0-9]{10}$/;
    return regex10Digits.test(phone);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    // CRITICAL: If user types in a field that has old data, clear ALL form data
    const oldValue = formData[name];
    if (value.length > 0 && oldValue && value !== oldValue) {
      console.log('🔥 USER TYPING IN FIELD WITH OLD DATA - CLEARING ALL FORM DATA');
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
    }

    // Limit phone number to exactly 10 digits
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // Remove non-numeric characters
      const limitedValue = numericValue.slice(0, 10); // Limit to 10 digits
      setFormData({ ...formData, [name]: limitedValue });
      setErrors({ ...errors, phone: '' });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === 'password' || name === 'confirmPassword') {
      if (formData.password && formData.confirmPassword && name === 'confirmPassword' && formData.password !== value) {
        setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      } else {
        setErrors({ ...errors, confirmPassword: '' });
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validatePhone(formData.phone)) {
      setErrors({ ...errors, phone: 'Phone number must be exactly 10 digits (e.g., 9876543210)' });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ ...errors, confirmPassword: 'Passwords do not match' });
      return;
    }

    setErrors({});

    try {
      const submitData = {
        firstName: formData.name, // Adapt to backend expectation
        lastName: '',
        email: formData.email,
        phone: formData.phone,
        password: formData.password, // Use the password they entered
        isTempPassword: false
      };
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(submitData),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrors({ general: data.message || 'Registration failed' });
        return;
      }

      // Success, clear form and toggle to login
      setFormData({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
      });
      setErrors({});
      alert('Registration successful! Please login with your email and the password you just set.');
      onToggleForm();
    } catch (error) {
      console.error('Registration Error:', error);
      setErrors({ general: error.message });
    }
  };

  return (
    <div className="registration-page">
      <div className="illustration">
        <div className="woman-placeholder">👩‍🎓</div>
      </div>
      <div className="form-card">
        <h2 className="form-title">NEW ACCOUNT?</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">👤 Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="email">📧 Email</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter your email address" required />
          </div>
          <div className="form-group">
            <label htmlFor="phone">📱 Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="9876543210"
              required
            />
            {errors.phone && <span className="error-message">{errors.phone}</span>}
          </div>
          <div className="form-group">
            <label htmlFor="password">🔒 Password</label>
            <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label htmlFor="confirmPassword">🔄 Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
            {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
          </div>
          <button type="submit" className="register-btn">REGISTER</button>
        </form>
        {errors.general && <p className="error-message">{errors.general}</p>}
        <p className="login-link">
          Already have an account? <button onClick={onToggleForm} className="toggle-link-button" type="button">Log In</button>
        </p>
      </div>
      <div className="plant-placeholder">🌿</div>
    </div>
  );
};

export default SignupForm;
