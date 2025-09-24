import React, { useState } from 'react';
import './Form.css';

const LoginForm = ({ onToggleForm, onLoginSuccess }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    uniqueId: '',
    role: 'student' // Default to student
  });

  const [loginMode, setLoginMode] = useState('student'); // 'student' or 'teacher'

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // This is the corrected handleSubmit function
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let loginData;

      if (loginMode === 'teacher') {
        // Teacher login with unique ID and password
        loginData = {
          uniqueId: formData.uniqueId,
          password: formData.password,
          role: 'teacher'
        };
      } else {
        // Student login with email and password
        loginData = {
          email: formData.email,
          password: formData.password,
          role: 'student'
        };
      }

      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData),
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

        // For teachers, we need to store their email for password change functionality
        if (loginMode === 'teacher') {
          // Find the teacher's email from the database or use a default pattern
          localStorage.setItem('userEmail', `teacher.${formData.uniqueId}@shiksha.edu`);
        } else {
          localStorage.setItem('userEmail', formData.email);
        }

        // Call the success handler to switch the view
        onLoginSuccess({
          username: data.username,
          role: data.role,
          tempPassword: data.tempPassword,
          subject: data.subject
        });
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

      {/* Login Mode Toggle */}
      <div className="login-mode-toggle">
        <button
          type="button"
          className={loginMode === 'student' ? 'active' : ''}
          onClick={() => setLoginMode('student')}
        >
          Student Login
        </button>
        <button
          type="button"
          className={loginMode === 'teacher' ? 'active' : ''}
          onClick={() => setLoginMode('teacher')}
        >
          Teacher Login
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        {loginMode === 'teacher' ? (
          // Teacher Login Form
          <>
            <div className="form-group">
              <label htmlFor="uniqueId">Teacher ID</label>
              <input
                type="text"
                id="uniqueId"
                name="uniqueId"
                value={formData.uniqueId}
                onChange={handleChange}
                placeholder="Enter your Teacher ID (e.g., TEACH001)"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
              />
            </div>
            <div className="teacher-info">
              <p><strong>Subject:</strong> Will be displayed after login</p>
            </div>
          </>
        ) : (
          // Student Login Form
          <>
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password" value={formData.password} onChange={handleChange} required />
            </div>
          </>
        )}
        <button type="submit" className="submit-btn">Log In</button>
      </form>
      <p>
        Don't have an account? <span onClick={onToggleForm} className="toggle-link">Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;
