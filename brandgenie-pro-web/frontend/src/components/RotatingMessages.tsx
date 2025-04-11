import React, { useEffect, useState } from 'react';

const messages = [
  '🔍 Analyzing Web Page...',
  '📊 Extracting Brand Details...',
  '🧠 Summarizing Insights...'
];

const RotatingMessages: React.FC = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % messages.length);
    }, 3000); // Rotate every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center mt-6 text-white font-semibold text-lg">
      <div className="w-10 h-10 mb-4 border-4 border-t-4 border-t-yellow-300 border-white rounded-full animate-spin" />
      <p className="transition-opacity duration-500 ease-in-out animate-fade-in">
        {messages[index]}
      </p>
    </div>
  );
};

export default RotatingMessages;

