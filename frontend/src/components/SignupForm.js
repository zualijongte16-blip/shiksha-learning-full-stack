import React, { useState } from 'react';
import './Form.css';

const SignupForm = ({ onToggleForm, onRegistrationSuccess }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    class: '',
    course: '',
    address: '',
    email: '',
    phone: '',
    registrationFee: 1500,
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onRegistrationSuccess(formData);
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
          <label htmlFor="course">Course</label>
          <input type="text" id="course" name="course" value={formData.course} onChange={handleChange} required />
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
          <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="registrationFee">Registration Fee</label>
          <input type="text" id="registrationFee" name="registrationFee" value={formData.registrationFee} disabled />
        </div>
        <button type="submit" className="submit-btn">Sign Up</button>
      </form>
      <p>
        Already have an account? <span onClick={onToggleForm} className="toggle-link">Log In</span>
      </p>
    </div>
  );
};

export default SignupForm;