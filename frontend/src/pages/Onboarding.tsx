// src/pages/Onboarding.tsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const messages = ['Analyzing Website', 'Checking Details', 'Preparing Dashboard'];

const Onboarding: React.FC = () => {
  const [website, setWebsite] = useState('');
  const [loading, setLoading] = useState(false);
  const [currentMessage, setCurrentMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!website.trim()) return;
    setLoading(true);
    try {
      const response = await axios.post('https://brandgenie-backend-ene6c9htgcauegg3.westeurope-01.azurewebsites.net/api/analyze', { website });

      for (let i = 0; i < messages.length; i++) {
        setCurrentMessage(messages[i]);
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const brandId = response.data.id;
      navigate(`/dashboard/${brandId}`);
    } catch (error) {
      console.error('❌ Analysis failed:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-xl bg-white/20 backdrop-blur-md shadow-2xl rounded-2xl p-8">
        <h1 className="text-3xl md:text-4xl font-extrabold text-white text-center mb-8">
          🎯 Smart Brand Onboarding
        </h1>

        <div className="mb-5">
          <label className="block text-sm font-medium text-white mb-1">Company Website</label>
          <input
            type="text"
            className="w-full border border-white/30 bg-white/30 text-white placeholder-white/80 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-300 transition-all"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            placeholder="https://yourcompany.com"
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className={`w-full mt-6 bg-yellow-400 text-gray-900 font-bold py-2.5 px-6 rounded-xl transition duration-300 hover:bg-yellow-300 active:scale-95 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Working...' : ' Analyze Brand'}
        </button>

        {loading && (
          <div className="mt-6 text-white text-center animate-pulse">
            🔄 {currentMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
