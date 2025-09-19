import React, { useState } from 'react';
import { useStudent } from './context/StudentContext.js';
import { doc, getDoc } from 'firebase/firestore';

const LoginForm = () => {
  const { setView, setUserData, db, userId } = useStudent();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState({ text: '', type: '' });

  const handleLogin = async (e) => {
    e.preventDefault();

    if (db && userId) {
      const appId = 'default-app-id';
      const userDocRef = doc(db, `/artifacts/${appId}/users/${userId}/students`, userId);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const fetchedUserData = userDocSnap.data();
        if (fetchedUserData.password === password) {
          setUserData(fetchedUserData);
          setView('dashboard');
        } else {
          setMessage({ text: 'Incorrect password.', type: 'error' });
        }
      } else {
        setMessage({ text: 'User not found. Please sign up.', type: 'error' });
        setTimeout(() => setView('signup'), 2000);
      }
    } else {
      setMessage({ text: 'Login functionality is not yet implemented.', type: 'error' });
    }
  };

  return (
    <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
      <div className="flex justify-center mb-6">
        <img src="/shikhsa_logo.png" alt="Shiksha Institute Logo" className="rounded-full shadow-lg" />
      </div>
      <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleLogin} className="space-y-4">
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" required />
        {message.text && (
          <div className={`p-3 rounded-lg text-sm text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}
        <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded-lg shadow-md hover:bg-blue-700 transition duration-300 ease-in-out">
          Login
        </button>
      </form>
      <p className="mt-6 text-center text-gray-600">
        Don't have an account? <span onClick={() => setView('signup')} className="text-blue-600 cursor-pointer font-semibold hover:underline">Sign up now</span>
      </p>
    </div>
  );
};

export default LoginForm;
