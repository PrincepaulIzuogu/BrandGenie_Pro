// src/pages/OneButtonApp.tsx
import React, { useState } from 'react';
import axios from 'axios';
import logo from '../images/logo.png';

const OneButtonApp: React.FC = () => {
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async () => {
    if (!name.trim()) return alert('Please enter your name');
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/submit-name`, { name }); 
      setMessage(res.data.message);
    } catch (err) {
      setMessage('Something went wrong. Try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex flex-col items-center justify-center px-6">
      <img src={logo} alt="BrandGenie Pro" className="h-16 mb-6 animate-bounce" />
      <h1 className="text-3xl font-bold text-white mb-8 animate-fade-in">BrandGenie Pro</h1>

      <input
        type="text"
        placeholder="Enter your name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        className="px-4 py-3 rounded-xl mb-4 text-center text-black w-64"
      />

      <button
        onClick={handleSubmit}
        className="bg-yellow-400 text-black font-bold py-3 px-8 rounded-xl hover:bg-yellow-300 transition-all shadow-xl"
      >
        Save Name
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
