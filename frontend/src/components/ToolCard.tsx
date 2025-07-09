// src/components/ToolCard.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';

interface ToolCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  link: string;
  drafts?: number;
}

const ToolCard: React.FC<ToolCardProps> = ({ icon, title, description, link, drafts = 0 }) => {
  const navigate = useNavigate();

  return (
    <div
      onClick={() => navigate(link)}
      className="relative cursor-pointer bg-white hover:bg-gray-50 border border-gray-200 rounded-xl shadow-sm p-6 flex flex-col gap-3 transition duration-200 ease-in-out"
    >
      {/* Draft badge */}
      {drafts > 0 && (
        <div className="absolute top-2 right-2 bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full shadow">
          {drafts}
        </div>
      )}

      <div className="text-blue-600 text-3xl">{icon}</div>
      <h2 className="text-lg font-semibold truncate max-w-[85%]">{title}</h2>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  );
};

export default ToolCard;
