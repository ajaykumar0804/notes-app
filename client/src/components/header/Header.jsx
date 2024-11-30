import React, { useState } from 'react';
import { FaSearch, FaTimes } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSearch = async () => {
    // Search functionality (not changing here)
  };

  const handleSignOut = () => {
    localStorage.removeItem('token'); // Clear token
    setIsAuthenticated(false); // Update state
    navigate('/'); // Redirect to home
  };

  const handleSignIn = () => {
    navigate('/login'); // Redirect to login page
  };

  return (
    <header className="bg-white shadow py-4 px-8 flex justify-between items-center">
      <h1 className="text-xl font-bold text-gray-700 cursor-pointer" onClick={() => navigate('/')}>Notes App</h1>
      {/* Search Section */}
      {/* Search bar code remains unchanged */}
      
      {/* Sign In/Sign Out button */}
      {isAuthenticated ? (
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white font-semibold px-4 py-2 rounded hover:bg-red-600 transition"
        >
          Sign Out
        </button>
      ) : (
        <button
          onClick={handleSignIn}
          className="bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-green-600 transition"
        >
          Sign In
        </button>
      )}
    </header>
  );
};

export default Header;
