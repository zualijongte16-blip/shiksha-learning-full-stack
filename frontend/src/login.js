import React, { useState } from 'react';

const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [uniqueId, setUniqueId] = useState('');
  const [role, setRole] = useState('student');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    try {
      const loginData = {
        email: role === 'student' ? email : '',
        password,
        uniqueId: role === 'teacher' ? uniqueId : '',
        role
      };

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

        if (data.role === 'teacher') {
          localStorage.setItem('teacherId', data.teacherId || uniqueId);
          localStorage.setItem('subject', data.subject);
        }

        setMessage({ text: 'Login successful! Redirecting...', type: 'success' });

        // Redirect to dashboard
        setTimeout(() => {
          window.location.href = '/dashboard';
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
      <div className="flex mb-6 bg-gray-100 rounded-lg p-1">
        <button
          type="button"
          onClick={() => setRole('student')}
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
          onClick={() => setRole('teacher')}
          className={`flex-1 py-2 px-4 rounded-md font-medium transition-colors ${
            role === 'teacher'
              ? 'bg-blue-600 text-white'
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Teacher Login
        </button>
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
