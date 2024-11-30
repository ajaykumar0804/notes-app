import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { baseURL } from '../../api/constants/constant.js';
import Header from '../../components/header/Header.jsx';

function Login({ setIsAuthenticated }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false); // To prevent multiple submissions
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');

    // Frontend Validation
    if (!form.email || !form.password) {
      setError('Email and Password are required');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      setError('Invalid email format');
      return;
    }

    try {
      setIsSubmitting(true); // Disable the button during submission
      const res = await fetch(`${baseURL}/api/auth/login`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Something went wrong');
      }

      localStorage.setItem('token', data.token); // Store token after successful login
      setIsAuthenticated(true); // Update the authenticated state
      setMessage('Login successful!');
      navigate('/'); // Redirect to homepage
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false); // Re-enable the button
    }
  };

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-100 flex justify-center items-center">
        <div className="bg-white p-8 rounded-lg shadow-md w-96">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Login to Your Account</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />
            <input
              type="password"
              placeholder="Password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}
            {message && <p className="text-green-500 text-sm">{message}</p>}

            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full py-2 rounded-lg ${isSubmitting
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
            >
              {isSubmitting ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <p className="mt-6 text-gray-600 text-center">
            Don’t have an account?{' '}
            <Link to="/signup" className="text-green-500 hover:underline">
              Signup here
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}

export default Login;
