import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const ChooseUserRole: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleRoleSelection = (role: 'company' | 'independent') => {
    localStorage.setItem('userRole', role);
    setLoading(true);

    setTimeout(() => {
      if (role === 'company') {
        navigate('/dashboard');
      } else {
        navigate('/independent-dashboard');
      }
    }, 1000); // Simulate loading delay
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-700 to-purple-600 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>

        <h2 className="text-2xl font-bold text-white text-center mb-6">
          Choose how you want to continue
        </h2>

        {loading ? (
          <div className="text-center text-white animate-pulse">Redirecting...</div>
        ) : (
          <div className="flex flex-col gap-4 text-white">
            <button
              onClick={() => handleRoleSelection('company')}
              className="bg-yellow-400 text-black font-semibold py-3 rounded-xl hover:bg-yellow-300 transition"
            >
              Continue as Company User
            </button>
            <button
              onClick={() => handleRoleSelection('independent')}
              className="bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
            >
              Continue as Independent User
            </button>
          </div>
        )}

        <p className="text-sm text-center text-white mt-6">
          Not your account?{' '}
          <span
            onClick={() => navigate('/login')}
            className="underline cursor-pointer hover:text-yellow-300"
          >
            Go back
          </span>
        </p>
      </div>
    </div>
  );
};

export default ChooseUserRole;
