import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4 text-center fixed bottom-0 w-full">
      <p>&copy; {new Date().getFullYear()} Notes App. All rights reserved by Ajay.</p>
    </footer>
  );
};

export default Footer;
