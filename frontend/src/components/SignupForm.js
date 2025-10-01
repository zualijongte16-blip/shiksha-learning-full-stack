import React, { useState } from 'react';
import './Form.css';

const SignupForm = ({ onToggleForm, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    address: '',
    email: '',
    phone: '',
    password: '',
    registrationFee: 1500,
  });

  const [errors, setErrors] = useState({});

  const validatePhone = (phone) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phone);
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
      setErrors({ ...errors, phone: 'Phone number must be exactly 10 digits' });
      return;
    }

    // Clear any existing errors
    setErrors({});

    try {
      const response = await fetch('http://localhost:5001/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      // Registration successful, proceed to login
      onRegistrationSuccess(formData);
    } catch (error) {
      console.error('Registration Error:', error);
      setErrors({ ...errors, general: error.message });
    }
  };

  return (
    <div className="form-container">
      <h2>Create Your Account</h2>
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
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
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
            placeholder="Enter 10-digit phone number"
            maxLength="10"
            pattern="[0-9]{10}"
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
      <p>
        Already have an account? <button onClick={onToggleForm} className="toggle-link-button" type="button">Log In</button>
      </p>
    </div>
  );
};

export default SignupForm;