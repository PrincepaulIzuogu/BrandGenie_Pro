import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const Login: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 to-blue-500 flex items-center justify-center px-6">
      <div className="bg-white/20 backdrop-blur-lg p-10 rounded-2xl w-full max-w-lg shadow-2xl animate-fade-in">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="BrandGenie Pro" className="h-16 animate-bounce" />
        </div>

        <h2 className="text-3xl font-bold text-white text-center mb-8">Welcome to BrandGenie Pro</h2>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => navigate('/login/company')}
            className="bg-yellow-400 text-black font-semibold py-3 rounded-xl hover:bg-yellow-300 transition"
          >
            Login as Company
          </button>
          <button
            onClick={() => navigate('/login/user')}
            className="bg-white text-blue-600 font-semibold py-3 rounded-xl hover:bg-gray-200 transition"
          >
            Login as User
          </button>
        </div>

        <div className="mt-6 text-center text-white text-sm">
          <p>
            Forgot your password?{' '}
            <span
              onClick={() => navigate('/forgot-password')}
              className="underline cursor-pointer hover:text-yellow-300"
            >
              Reset here
            </span>
          </p>
          <p className="mt-2">
            New here?{' '}
            <span
              onClick={() => navigate('/signup')}
              className="underline cursor-pointer hover:text-yellow-300"
            >
              Sign up
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
