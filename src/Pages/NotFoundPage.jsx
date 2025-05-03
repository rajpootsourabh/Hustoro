import React from 'react';

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 text-center">
      <h1 className="text-6xl font-bold text-gray-800 mb-4">404 - Page Not Found</h1>
      <p className="text-xl text-gray-500 mb-6">Oops! The page you are looking for does not exist.</p>
      <a href="/" className="text-lg text-blue-500 hover:text-blue-700">Go back to home</a>
    </div>
  );
};

export default NotFound;
