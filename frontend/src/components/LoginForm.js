import React, { useState } from 'react';
import './Form.css';

const LoginForm = ({ onToggleForm, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This is the corrected handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json(); // Get the JSON data regardless of response status

      if (!response.ok) {
        // Use the error message from the backend
        throw new Error(data.message || 'Login failed');
      }
      
      // Check if the token exists in the response data
      if (data.token) {
        // Save the token to the browser's local storage
        localStorage.setItem('token', data.token);

        // Call the success handler to switch the view
        onLoginSuccess({ username: data.username });
      } else {
         throw new Error('Login successful, but no token received.');
      }

    } 
    
    catch (error) {
      console.error('Login Error:', error);
      alert(error.message); // Show the specific error to the user
    }
  };
  
  return (
    <div className="form-container">
      <h2>Log In</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="submit-btn">Log In</button>
      </form>
      <p>
        Don't have an account? <span onClick={onToggleForm} className="toggle-link">Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;