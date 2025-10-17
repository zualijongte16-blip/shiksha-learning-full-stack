import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    console.log('🔐 ATTEMPTING LOGIN:');
    console.log('Selected role:', role);
    console.log('Email:', email);
    console.log('UniqueId:', uniqueId);
    console.log('Password:', password ? '***' : 'NOT SET');

    // FORCE TEACHER ROLE FOR TESTING
    if (uniqueId === '2001' || uniqueId === '2002' || uniqueId === 'T001') {
      console.log('🎯 DETECTED TEACHER ID! Forcing role to teacher...');
      setRole('teacher');
    }

    try {
      const loginData = {
        email: role === 'student' ? email : '',
        password,
        uniqueId: role === 'teacher' ? uniqueId : '',
        role
      };

      console.log('📤 Sending login data:', {
        ...loginData,
        password: loginData.password ? '***' : 'NOT SET'
      });

      const response = await fetch('http://localhost:5001/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      const data = await response.json();

      if (response.ok) {
        // Store authentication data
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', data.username);
        localStorage.setItem('role', data.role);
        localStorage.setItem('tempPassword', data.tempPassword);

        console.log('🔐 LOGIN SUCCESS - Stored in localStorage:');
        console.log('Token:', data.token ? 'SET' : 'NOT SET');
        console.log('Username:', data.username);
        console.log('Role:', data.role);
        console.log('TempPassword:', data.tempPassword);

        if (data.role === 'teacher') {
          localStorage.setItem('teacherId', data.teacherId || uniqueId);
          localStorage.setItem('subject', data.subject);
          console.log('TeacherId:', data.teacherId || uniqueId);
        }

        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });

        // Check if user needs to change password immediately
        setTimeout(() => {
          if (data.tempPassword) {
            console.log('🔑 Redirecting to password change page');
            // Redirect to password change page
            navigate('/change-password');
          } else {
            console.log('📊 Redirecting to dashboard');
            // Redirect to dashboard
            navigate('/dashboard');
          }
        }, 1000);
      } else {
        setMessage({ text: data.message || 'Login failed', type: 'error' });
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage({ text: 'Network error. Please try again.', type: 'error' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex justify-center mb-6">
        <img src="/shikhsa_logo.png" alt="Shiksha Institute Logo" className="rounded-full shadow-lg" />
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>

      {/* Role Selection */}
      <div className="mb-6">
        <div className="flex bg-gray-100 rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => {
              setRole('student');
              console.log('🔄 Role changed to: student');
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              role === 'student'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Student Login
          </button>
          <button
            type="button"
            onClick={() => {
              setRole('teacher');
              console.log('🔄 Role changed to: teacher');
            }}
            className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
              role === 'teacher'
                ? 'bg-blue-600 text-white'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Teacher Login
          </button>
        </div>

        {/* ROLE INDICATOR */}
        <div style={{
          background: role === 'teacher' ? 'linear-gradient(45deg, #2196F3 0%, #1976D2 100%)' : 'linear-gradient(45deg, #4CAF50 0%, #45a049 100%)',
          color: 'white',
          padding: '10px',
          borderRadius: '8px',
          textAlign: 'center',
          fontSize: '16px',
          fontWeight: 'bold',
          marginBottom: '10px'
        }}>
          {role === 'teacher' ? '👨‍🏫 TEACHER LOGIN SELECTED' : '🎓 STUDENT LOGIN SELECTED'}
          <br />
          <small>Make sure to select "Teacher Login" for teacher access!</small>
        </div>
      </div>

      <form onSubmit={handleLogin} className="space-y-4">
        {role === 'student' ? (
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        ) : (
          <input
            type="text"
            value={uniqueId}
            onChange={(e) => setUniqueId(e.target.value)}
            placeholder="Teacher ID (e.g., TEACH001)"
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        )}
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
        {message.text && (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}>
            {message.text}
          </div>
        )}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out"
        >
          Log In
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Don't have an account? <span className="text-blue-600 cursor-pointer font-semibold hover:underline">Sign Up</span>
      </p>
    </div>
  );
};

export default LoginForm;
