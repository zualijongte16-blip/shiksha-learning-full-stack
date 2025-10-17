import React, { useState } from 'react';
import './Form.css';

const SignupForm = ({ onToggleForm }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    class: '',
    password: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    const allowedPrefixes = ['60', '811', '812', '813', '814', '815', '816', '817', '818', '819'];
    const regexPlus91 = /^\+91[0-9]{10}$/;
    if (regexPlus91.test(phone)) {
      return true;
    }
    for (const prefix of allowedPrefixes) {
      const regexPrefix = new RegExp(`^${prefix}[0-9]{8}$`);
      if (regexPrefix.test(phone)) {
        return true;
      }
    }
    return false;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    if (name === 'phone') {
      setErrors({ ...errors, phone: '' });
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
      setErrors({ ...errors, phone: '+91 or prefixes like 60, 811, etc. and be 10 digits long' });
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
        password: formData.password
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

      // Success, toggle to login or show message
      alert('Registration successful! Please login with your email and password.');
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
              placeholder="+91 with 10 digits"
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
