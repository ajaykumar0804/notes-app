import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login/Login.jsx";
import Signup from "./pages/SignUp/SignUp.jsx";
import HomePage from './pages/home/HomePage.jsx';

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check authentication status on app load
  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsAuthenticated(!!token); // Set to true if token exists
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<HomePage isAuthenticated={isAuthenticated} setIsAuthenticated={setIsAuthenticated} />} />
      </Routes>
    </Router>
  );
};

export default App;
