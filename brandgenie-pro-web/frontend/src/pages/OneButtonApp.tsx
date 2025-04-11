import React, { useState } from 'react';
import logo from '../images/logo.png';

const OneButtonApp: React.FC = () => {
  const [message, setMessage] = useState('');

  const handleClick = () => {
    setMessage('🚀 The team is currently working on interviews for the app. Come back in May!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center justify-center px-6">
      <img src={logo} alt="BrandGenie Pro" className="h-16 mb-6 animate-bounce" />
      <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in">BrandGenie Pro</h1>
      <button
        onClick={handleClick}
        className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-300 transition-all shadow-xl"
      >
        Click Me
      </button>

      {message && (
        <p className="mt-8 text-white text-center max-w-md text-lg animate-fade-in">
          {message}
        </p>
      )}
    </div>
  );
};

export default OneButtonApp;
