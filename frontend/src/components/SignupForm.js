import React, { useState } from 'react';
import './Form.css';

const SignupForm = ({ onToggleForm, onRegistrationSuccess, onBackToHome }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    address: '',
    email: '',
    phone: '',
    registrationFee: 1500,
  });

  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    // Allow phone numbers starting with +91 followed by 10 digits
    // or starting with 60, 811, etc. followed by 8 digits (total 10 digits)
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

    // Clear phone error when user starts typing
    if (name === 'phone') {
      setErrors({ ...errors, phone: '' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate phone number
    if (!validatePhone(formData.phone)) {
      setErrors({ ...errors, phone: 'Phone number must start with +91 or prefixes like 60, 811, etc. and be 10 digits long' });
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      const response = await fetch('http://localhost:3001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (data.message && data.message.includes('already exists')) {
          setErrors({ ...errors, duplicateUser: 'A user with this phone number already exists. If this is you, please reset your password instead of signing up again.' });
        } else {
          setErrors({ ...errors, general: data.message || 'Registration failed' });
        }
        return;
      }

      // Registration successful, clear password field and proceed to login
      setFormData({ ...formData, password: '' });
      onRegistrationSuccess(formData);
    } catch (error) {
      console.error('Registration Error:', error);
      setErrors({ ...errors, general: error.message });
    }
  };

  return (
    <div className="auth-form-container">
      <div className="form-header">
        <h2>Create Your Account</h2>
      </div>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" value={formData.firstName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" value={formData.lastName} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="class">Class</label>
          <select id="class" name="class" value={formData.class} onChange={handleChange} required>
            <option value="" disabled>Select a class</option>
            {Array.from({ length: 5 }, (_, i) => i + 8).map(cls => (
              <option key={cls} value={cls}>{cls}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input type="text" id="address" name="address" value={formData.address} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone No.</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
            placeholder="Enter phone number starting with +91 or 60, 811, etc."
            maxLength="13"
            pattern="^(\+91[0-9]{10}|60[0-9]{8}|811[0-9]{8}|812[0-9]{8}|813[0-9]{8}|814[0-9]{8}|815[0-9]{8}|816[0-9]{8}|817[0-9]{8}|818[0-9]{8}|819[0-9]{8})$"
            className="input-field"
          />
          {errors.phone && <span className="error-message">{errors.phone}</span>}
        </div>
        <div className="form-group">
          <label htmlFor="registrationFee">Registration Fee</label>
          <input type="text" id="registrationFee" name="registrationFee" value={formData.registrationFee} disabled />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      {errors.general && <p className="error-message">{errors.general}</p>}
      {errors.duplicateUser && (
        <div className="error-message duplicate-user-error">
          <p>{errors.duplicateUser}</p>
          <button onClick={onToggleForm} className="reset-password-btn" type="button">Go to Login & Reset Password</button>
        </div>
      )}
      <p>
        Already have an account? <button onClick={onToggleForm} className="toggle-link-button" type="button">Log In</button>
      </p>
    </div>
  );
};

export default SignupForm;
