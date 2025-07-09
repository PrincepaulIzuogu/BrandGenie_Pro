
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../images/logo.png';

const words = ['Design.', 'Strategy.', 'Content.', 'AI.'];

const Home: React.FC = () => {
  const [currentWord, setCurrentWord] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const wordInterval = setInterval(() => {
      setCurrentWord((prev) => (prev + 1) % words.length);
    }, 1000);

    const redirect = setTimeout(() => {
      navigate('/login');
    }, 4000);

    return () => {
      clearInterval(wordInterval);
      clearTimeout(redirect);
    };
  }, [navigate]);

  return (
    <div className="relative flex flex-col items-center justify-center h-screen bg-gradient-to-br from-[#4f46e5] via-[#9333ea] to-[#ec4899] overflow-hidden text-white">
      {/* Animated blobs */}
      <div className="absolute w-96 h-96 bg-pink-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob -top-20 -left-20" />
      <div className="absolute w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000 top-40 -right-20" />
      <div className="absolute w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-4000 bottom-20 left-20" />

      {/* Bigger Logo */}
      <img
        src={logo}
        alt="BrandGenie Pro Logo"
        className="w-[400px] md:w-[500px] h-auto drop-shadow-2xl animate-float transition-all duration-700"
      />

      {/* Rotating Text */}
      <h2 className="mt-4 text-xl md:text-3xl font-medium italic tracking-wider text-center bg-clip-text text-transparent bg-gradient-to-r from-yellow-300 via-white to-yellow-400 animate-fade-in">
        {words[currentWord]}
      </h2>
    </div>
  );
};

export default Home;